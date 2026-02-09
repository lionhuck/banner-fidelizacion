export type ReportEntidadesEquipos = {
  actualizado: boolean;
  auditoria: string | null;

  entidad_codigo_interno: string | null;
  entidad_id: number | null;
  entidad_nombre: string | null;

  equipo_id: number | null;
  fecha_alta_posicion: string | null;

  grupo_administracion_nombre: string | null;

  libre: boolean;
  libre_observaciones: string | null;

  localidad: string | null;
  localidad_id: number | null;

  macs: string | null;

  pais: string | null;
  pais_id: number | null;

  plantilla: string | null;
  plantilla_id: number | null;
  plantilla_vertical: boolean | null;

  posicion_id: number | null;
  posicion_numero: number | null;

  provincia: string | null;
  provincia_id: number | null;

  sistema: string | null;

  tipo_equipo: string | null;
  tipo_modelo: string | null;

  ubicacion: string | null;
  ubicacion_codigo_interno: string | null;
  ubicacion_id: number | null;

  uid: string | null;
  ultima_conexion: string | null;

};
