import { preloadApi } from '../utils/api';

const settle = (requests: Array<Promise<unknown> | unknown>) =>
  Promise.allSettled(requests);

export const preloadBiblioteca = () =>
  settle([
    preloadApi('/categoria/obtener/all/'),
    preloadApi('/categoria/recurso-edu/obtener/all/'),
    preloadApi('/cuestionario/obtener/all/'),
  ]);

export const preloadForo = () =>
  settle([
    preloadApi('/usuario/me/'),
    preloadApi('/publicacion/categorias/'),
    preloadApi('/publicacion/all/'),
  ]);

export const preloadHilo = (id?: string) =>
  settle([
    preloadApi('/usuario/me/'),
    id ? preloadApi(`/publicacion/${id}/`) : undefined,
  ]);

export const preloadGuia = (id?: string) =>
  Number.isFinite(Number(id))
    ? settle([preloadApi(`/guia/obtener/${Number(id)}/`)])
    : Promise.resolve();

export const preloadCuestionario = () =>
  settle([preloadApi('/cuestionario/obtener/all/')]);

export const preloadAdminLayout = () => settle([preloadApi('/usuario/me/')]);

export const preloadAdminUsers = () =>
  settle([preloadApi('/usuario/get/all/')]);

export const preloadAdminContent = () =>
  settle([
    preloadApi('/categoria/recurso-edu/obtener/all/'),
    preloadApi('/categoria/obtener/all/'),
  ]);

export const preloadAdminCuestionarios = () =>
  settle([preloadApi('/cuestionario/obtener/all/')]);

export const preloadAdminSolicitudes = () =>
  settle([preloadApi('/solicitud/all/')]);

export const preloadAdminPublicaciones = () =>
  settle([preloadApi('/publicacion/all/')]);
