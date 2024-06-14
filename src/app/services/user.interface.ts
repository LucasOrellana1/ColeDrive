
export interface Conductor{

  rut: string,
  nombre: string,
  apellido: string,
  email: string,
  telefono: string,
  comuna: String, //campo comuna agreegado
  
  patenteVehiculo: string,
  marcaVehiculo: string,
  
  asistente: {
    nombre: string,
    rut: string,
  },
 
  activado?: false,
  colegioId?: null,

    //Valor utilizado para establecer el GUARD
  tipoCuenta? : 2

}

export interface Familia{
  nombre: string,
  apellido: string,
  email: string,
  colegio: string,//campo colegio agreegado
  comuna: string,//campo comuna agreegado

  telefono: string,
  direccion: string,
  rut: string,//Campo Rut Agregado//
  numeroHijos: string,
  hijos: Array<string>,
  tipoCuenta? : number
}

export interface Colegio{

  nombre: string,
  email: string,
  telefono: string,
  direccion: string,
  comuna: string,
  tipoCuenta? : 3
}

export interface CentroPadres{

  nombre: string,
  email: string,
  tipoCuenta? : 4
}


export interface FacturaServicios {
  proveedor: {
    nombre: string;
    identificacion_fiscal: string;
    telefono: string;
    correo_electronico: string;
  };

  cliente: {
    nombre: string;
    identificacion_fiscal: string;
  };

  factura: {
    numero?: '*';
    fecha_emision: string;
    fecha_vencimiento: string;
  };
  descripcion?: 'Pago servicio de transporte escolar.',
  total?: 'Por definir'
}