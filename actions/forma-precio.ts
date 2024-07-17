import toast from "react-hot-toast";

export const formaPrecio = (precio: Number) => {
  const cambioPrecio = parseFloat(precio.toFixed(2));
  return (
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(cambioPrecio) + "  USD"
  );
};
export const valorDolar = (precio: string): number => {
  // Eliminar los caracteres no numéricos (excepto el punto decimal)
  const precioLimpio = precio.replace(/[^0-9.-]+/g, "");

  // Convertir la cadena limpia a un número
  const precioNumero = Number(precioLimpio);

  if (!isNaN(precioNumero)) {
    const resultado = precioNumero * 36;
    console.log(resultado);
    toast.success(`cambio a  BCV`);
    return resultado;
  } else {
    console.log("El valor proporcionado no es un número válido.");
    return 0; // Retornar 0 o cualquier otro valor por defecto
  }
};
