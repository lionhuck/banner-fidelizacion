"use client";

import React, { useMemo, useState } from "react";
import { UserGroup } from "@/lib/grouping";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ReportsTableView } from "./ReportsTableView";

export function UserGroupDetailsDialog({
  group,
  isOpen,
  onOpenChange,
}: {
  group: UserGroup;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [selectedLocKey, setSelectedLocKey] = useState<string | null>(null);

  const selectedLocation = useMemo(() => {
    if (!selectedLocKey) return null;
    return group.locations.find(l => l.key === selectedLocKey) ?? null;
  }, [group.locations, selectedLocKey]);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">{group.name}</DialogTitle>
          <div className="text-sm text-muted-foreground">
            Total: <b>{group.total}</b> · Ocupados: <b>{group.occupied}</b> · Libres: <b>{group.free}</b>
          </div>
        </DialogHeader>

        <Tabs defaultValue="locations" className="w-full">
          <TabsList>
            <TabsTrigger value="locations">Ubicaciones</TabsTrigger>
            <TabsTrigger value="devices">Equipos</TabsTrigger>
          </TabsList>

          <TabsContent value="locations" className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {group.locations.map(loc => (
                <Card
                  key={loc.key}
                  className="cursor-pointer rounded-3xl border-0 shadow-lg shadow-black/5 hover:shadow-black/15 hover:scale-[1.005] transition-all"
                  onClick={() => setSelectedLocKey(loc.key)}
                >
                  <CardContent className="p-5">
                    <div className="text-lg font-semibold truncate">{loc.name}</div>
                    <div className="mt-2 text-sm text-muted-foreground">
                      Total: <b>{loc.total}</b> · Ocupados: <b>{loc.occupied}</b> · Libres: <b>{loc.free}</b>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {selectedLocation && (
              <div className="mt-6">
                <div className="mb-2 text-sm text-muted-foreground">
                  Mostrando equipos de <b>{selectedLocation.name}</b>
                </div>
                <div className="rounded-xl bg-accent p-4">
                  <ReportsTableView
                    // @ts-ignore si tu ReportsTableView espera props extra, lo ajusto
                    records={selectedLocation.records}
                    // Si tu tabla depende de preferences, decime y lo integramos con tu page
                    preferences={undefined}
                    onPreferencesChange={() => {}}
                  />
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="devices" className="mt-4">
            <div className="rounded-xl bg-accent p-4">
              <ReportsTableView
                // @ts-ignore
                records={group.records}
                preferences={undefined}
                onPreferencesChange={() => {}}
              />
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
