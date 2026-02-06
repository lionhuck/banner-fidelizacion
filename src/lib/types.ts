export type SystemSource = "banner1" | "banner2";

export type ReportEntidadesEquipos = {
  sistema: SystemSource;

  entidad_id: number | null;
  entidad_nombre: string | null;
  entidad_codigo_interno: string | null;

  grupo_administracion_nombre: string | null;

  ubicacion_id: number | null;
  ubicacion: string | null;
  ubicacion_codigo_interno: string | null;

  localidad_id: number | null;
  localidad: string | null;
  provincia_id: number | null;
  provincia: string | null;
  pais_id: number | null;
  pais: string | null;

  equipo_id: number | null;
  uid: string | null;
  macs: string | null;

  tipo_equipo: string | null;
  tipo_modelo: string | null;

  actualizado: boolean;
  ultima_conexion: string | null;

  [k: string]: any;
};

export type UnifiedDeviceRow = {
  system: SystemSource;

  entityId: number | null;
  entityName: string | null;
  entityTaxId: string | null;
  groupName: string | null;

  locationId: number | null;
  locationName: string | null;
  locationCode: string | null;

  city: string | null;
  province: string | null;
  country: string | null;

  deviceId: number | null;
  uid: string | null;
  macsRaw: string | null;
  macs: string[];

  deviceType: string | null;
  model: string | null;

  updated: boolean;
  lastSeen: Date | null;

  isActive: boolean;
  activeReason: "updated" | "lastSeen" | "inactive";
};
