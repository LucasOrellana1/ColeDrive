export interface UserInterface{
    email : string;
    username : string;
  }
  
export interface Conductor{

  rutConductor: string,
  nombreConductor: string,
  apellidoConductor: string,
  emailConductor: string,
  telefonoConductor: string,
  
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
  tipoCuent? : 1
}