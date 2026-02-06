import { UnifiedDeviceRow } from "./types";

export type CustomerGroup = {
  customerKey: string;
  customerName: string;

  totalDevices: number;
  activeDevices: number;
  inactiveDevices: number;

  entities: EntityGroup[];
};

export type EntityGroup = {
  entityKey: string;
  entityName: string;
  entityTaxId: string | null;
  groupName: string | null;

  totalDevices: number;
  activeDevices: number;
  inactiveDevices: number;

  locations: LocationGroup[];
};

export type LocationGroup = {
  locationKey: string;
  locationName: string;
  locationCode: string | null;

  totalDevices: number;
  activeDevices: number;
  inactiveDevices: number;

  devices: UnifiedDeviceRow[];
};

function safeKey(...parts: Array<string | number | null | undefined>) {
  return parts.map(p => (p ?? "")).join("::");
}

// Definición de "Cliente" (hasta que exista mapping real)
export function getCustomerName(r: UnifiedDeviceRow): string {
  return r.groupName?.trim()
    || r.entityName?.trim()
    || r.entityTaxId?.trim()
    || "(Sin cliente)";
}

export function getCustomerKey(r: UnifiedDeviceRow): string {
  // Importante incluir system para evitar choques entre banner1/banner2
  return safeKey(r.system, "customer", getCustomerName(r));
}

export function getEntityKey(r: UnifiedDeviceRow): string {
  return safeKey(
    r.system,
    "entity",
    r.entityId ?? r.entityTaxId ?? r.entityName ?? "unknown"
  );
}

export function groupByCustomerEntityLocation(rows: UnifiedDeviceRow[]): CustomerGroup[] {
  const customerMap = new Map<string, any>();

  for (const r of rows) {
    const customerKey = getCustomerKey(r);
    const customerName = getCustomerName(r);

    if (!customerMap.has(customerKey)) {
      customerMap.set(customerKey, {
        customerKey,
        customerName,
        totalDevices: 0,
        activeDevices: 0,
        inactiveDevices: 0,
        entityMap: new Map<string, any>(),
      });
    }

    const c = customerMap.get(customerKey);
    c.totalDevices += 1;
    if (r.isActive) c.activeDevices += 1;
    else c.inactiveDevices += 1;

    const entityKey = getEntityKey(r);
    if (!c.entityMap.has(entityKey)) {
      c.entityMap.set(entityKey, {
        entityKey,
        entityName: r.entityName ?? "(Sin razón social)",
        entityTaxId: r.entityTaxId ?? null,
        groupName: r.groupName ?? null,
        totalDevices: 0,
        activeDevices: 0,
        inactiveDevices: 0,
        locationMap: new Map<string, any>(),
      });
    }

    const e = c.entityMap.get(entityKey);
    e.totalDevices += 1;
    if (r.isActive) e.activeDevices += 1;
    else e.inactiveDevices += 1;

    const locationKey = safeKey(
      r.system,
      "loc",
      r.locationId ?? r.locationCode ?? r.locationName ?? "unknown"
    );

    if (!e.locationMap.has(locationKey)) {
      e.locationMap.set(locationKey, {
        locationKey,
        locationName: r.locationName ?? "(Sin ubicación)",
        locationCode: r.locationCode ?? null,
        totalDevices: 0,
        activeDevices: 0,
        inactiveDevices: 0,
        devices: [],
      });
    }

    const loc = e.locationMap.get(locationKey);
    loc.totalDevices += 1;
    if (r.isActive) loc.activeDevices += 1;
    else loc.inactiveDevices += 1;

    loc.devices.push(r);
  }

  const customers: CustomerGroup[] = Array.from(customerMap.values()).map((c: any) => {
    const entities: EntityGroup[] = Array.from(c.entityMap.values()).map((e: any) => ({
      entityKey: e.entityKey,
      entityName: e.entityName,
      entityTaxId: e.entityTaxId,
      groupName: e.groupName,
      totalDevices: e.totalDevices,
      activeDevices: e.activeDevices,
      inactiveDevices: e.inactiveDevices,
      locations: Array.from(e.locationMap.values()),
    }));

    // ordenar entidades por activos desc
    entities.sort((a, b) => b.activeDevices - a.activeDevices);

    for (const ent of entities) {
      ent.locations.sort((a, b) => b.activeDevices - a.activeDevices);
    }

    return {
      customerKey: c.customerKey,
      customerName: c.customerName,
      totalDevices: c.totalDevices,
      activeDevices: c.activeDevices,
      inactiveDevices: c.inactiveDevices,
      entities,
    };
  });

  // ordenar clientes por activos desc (y total desc como desempate)
  customers.sort((a, b) => (b.activeDevices - a.activeDevices) || (b.totalDevices - a.totalDevices));

  return customers;
}
