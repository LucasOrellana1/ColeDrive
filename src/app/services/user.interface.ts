
export interface Conductor{

  rut: string,
  nombre: string,
  apellido: string,
  email: string,
  telefono: string,
  
  patenteVehiculo: string,
  marcaVehiculo: string,
  
  nombreAsistente: string,
  apellidoAsistente: string,
  rutAsistente: string,

  activado?: false,
  colegioId?: null,

    //Valor utilizado para establecer el GUARD
  tipoCuenta? : 2

}

export interface Familia{
  nombre: string,
  apellido: string,
  email: string,

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