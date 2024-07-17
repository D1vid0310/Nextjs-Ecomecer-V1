"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CirclePlus } from "lucide-react";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  actualizarDoc,
  actualizarName,
  addDoct,
  registro,
  setDoct,
  subirArchivo,
} from "@/lib/firebase";
import { useEffect, useState } from "react";
import { LoaderCircle } from "lucide-react";
import toast from "react-hot-toast";
import { User } from "@/interfaces/user.interfaces";
import { ItemImage } from "@/interfaces/item-img.interface";
import BasicDemoDropzone from "@/components/drop-img";
import { useUser } from "@/hooks/use-user";
import { Productos } from "@/interfaces/product.interfaces";
import Image from "next/image";

interface CrearProductosProps {
  children: React.ReactNode;
  productoActu?: Productos;
  getItems: () => Promise<void>;
}

export function CrearProductos({
  getItems,
  children,
  productoActu,
}: CrearProductosProps) {
  const user = useUser();
  const [isCargando, setisCargando] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const [img, setImg] = useState<string>("");

  const formSchema = z.object({
    img: z.object({
      path: z.string(),
      url: z.string(),
    }),
    nombre: z.string().min(4, {
      message: "Este campo es requerido y debe de tener minimo 4 caracteres",
    }),
    precio: z.coerce.number().gte(0, "El valor minimo debe ser 0"),
    unidades: z.coerce.number().gte(0, "El valor minimo debe ser 0"),
  });

  //Formulario de inicio.

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: productoActu
      ? productoActu
      : {
          img: {} as ItemImage,
          nombre: "",
          precio: undefined,
          unidades: undefined,
        },
  });

  const { register, handleSubmit, formState, setValue } = form;
  const { errors } = formState;

  const handelImg = (url: string) => {
    let path = productoActu
      ? productoActu.img.path
      : `${user?.uid}/${Date.now()}`;
    setValue("img", { url, path });
    setImg(url);
  };

  useEffect(() => {
    if (productoActu) setImg(productoActu.img.url);
  }, [open]);

  const onSubmit = async (item: z.infer<typeof formSchema>) => {
    if (productoActu) actualizarProduDb(item);
    else crearProduDb(item);
  };

  //Funcion Para Crear Productos

  const crearProduDb = async (item: Productos) => {
    const path = `users/${user?.uid}/products`;
    setisCargando(true);
    try {
      const base64 = item.img.url;
      const imgPath = item.img.path;

      const imgUrl = await subirArchivo(imgPath, base64);
      item.img.url = imgUrl;

      await addDoct(path, item);

      toast.success(`Se creado un producto correctamente`);
      await getItems();
      setOpen(false);
      form.reset();
    } catch (error: any) {
      toast.error(error.message, { duration: 2500 });
    } finally {
      setisCargando(false);
    }
  };

  //Funcion para  actualizar productos
  const actualizarProduDb = async (item: Productos) => {
    const path = `users/${user?.uid}/products/${productoActu?.id}`;
    setisCargando(true);
    try {
      if (productoActu?.img.url !== item.img.url) {
        const base64 = item.img.url;
        const imgPath = item.img.path;

        const imgUrl = await subirArchivo(imgPath, base64);
        item.img.url = imgUrl;
      }

      await actualizarDoc(path, item);

      toast.success(`Se actualizado su producto correctamente`);
      await getItems();
      setOpen(false);
      form.reset();
    } catch (error: any) {
      toast.error(error.message, { duration: 21900 });
      console.log(error);
    } finally {
      setisCargando(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {productoActu ? "Actualizar Producto" : "Crear Producto"}
          </DialogTitle>
          <DialogDescription>
            Gestiona tu producto con la siguiente informacion
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-2">
            <div className="mb-3">
              <Label htmlFor="img">Imagen</Label>
              {img ? (
                <div className="text-center">
                  <Image
                    className="w-[50px] m-auto"
                    width={1000}
                    height={1000}
                    src={img}
                    alt="img-prod"
                  />
                  <Button
                    type="button"
                    onClick={() => handelImg("")}
                    disabled={isCargando}
                    className="mt-6"
                  >
                    Remover Img
                  </Button>
                </div>
              ) : (
                <BasicDemoDropzone handelImg={handelImg} />
              )}
            </div>
            <div className="mb-3">
              <Label htmlFor="nombre">Nombre</Label>
              <Input
                {...register("nombre")}
                id="nombre"
                placeholder="Computadora"
                type="text"
              />
              {errors.nombre && (
                <p className="form-error">{errors.nombre.message}</p>
              )}
            </div>
            <div className="mb-3">
              <Label htmlFor="precio">Precio</Label>
              <Input
                {...register("precio")}
                id="precio"
                placeholder="0.00"
                type="number"
                step="0.01"
              />
              {errors.precio && (
                <p className="form-error">{errors.precio.message}</p>
              )}
            </div>
            <div className="mb-3">
              <Label htmlFor="unidades">Unidades Vendidas</Label>
              <Input
                {...register("unidades")}
                id="unidades"
                type="number"
                placeholder="0"
                step="1"
              />
              {errors.unidades && (
                <p className="form-error">{errors.unidades.message}</p>
              )}
            </div>

            <DialogFooter>
              <Button type="submit" disabled={isCargando}>
                {isCargando && (
                  <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                )}
                {productoActu ? "Actualizar" : "Crear"}
              </Button>
            </DialogFooter>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
