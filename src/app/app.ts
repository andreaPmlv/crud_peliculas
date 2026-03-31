import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { MovieService } from './services/movies.services';
import { Movie } from './models/movie';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class AppComponent implements OnInit {
  
  // Mantenemos 'data' como el Signal principal
  data = signal<Movie[]>([]);
  
  // Variables para el Modal y Notificaciones
  peliculaSeleccionada: any = null;
  modoEdicion: boolean = false;
  mensajeExito: string = '';
  mostrarNotificacion: boolean = false;

  constructor(private movieService: MovieService) {}

  ngOnInit() {
    this.cargarPeliculas();
  }

  cargarPeliculas() {
    this.movieService.getAllMovies().subscribe({
      next: (response: any) => {
        if (response?.data) {
          const mapped = response.data.map((item: any) => ({
            id: item.id,
            Title: item.attributes?.Title || item.Title,
            Sinopsis: item.attributes?.Sinopsis || item.Sinopsis,
            Stars: item.attributes?.Stars || item.Stars || 0
          }));
          this.data.set(mapped);
        }
      },
      error: (err) => console.error('Error al conectar con Strapi:', err)
    });
  }

  // --- LÓGICA DE EDICIÓN ---
  abrirEditor(peli: Movie) {
    this.peliculaSeleccionada = { ...peli }; // Clonamos para que el input no mueva la tabla antes de tiempo
    this.modoEdicion = true;
  }

  guardarEdicion() {
    if (!this.peliculaSeleccionada) return;
    
    const id = this.peliculaSeleccionada.id;
    const datosParaStrapi = {
      data: {
        Title: this.peliculaSeleccionada.Title,
        Sinopsis: this.peliculaSeleccionada.Sinopsis,
        Stars: this.peliculaSeleccionada.Stars
      }
    };

    this.movieService.updateMovie(id, datosParaStrapi as any).subscribe({
      next: () => {
        this.cargarPeliculas();
        this.cerrarModal();
        this.lanzarNotificacion('¡Cambios guardados con éxito!');
      },
      error: (err) => console.error('Error al editar:', err)
    });
  }

  eliminarPelicula(id: number) {
    if (confirm('¿Seguro que quieres eliminar esta película?')) {
      this.movieService.deleteMovie(id).subscribe({
        next: () => {
          this.cargarPeliculas();
          this.lanzarNotificacion('Película eliminada');
        }
      });
    }
  }

  agregarConDatos(titulo: string, sinopsis: string) {
    if (!titulo) return;
    const nueva = { data: { Title: titulo, Sinopsis: sinopsis, Stars: 1 } };
    this.movieService.createMovie(nueva as any).subscribe({
      next: () => {
        this.cargarPeliculas();
        this.lanzarNotificacion('¡Añadida correctamente!');
      }
    });
  }

  calificar(peli: Movie, nota: number) {
    const body = { data: { Stars: nota } };
    this.movieService.updateMovie(peli.id, body as any).subscribe({
      next: () => this.cargarPeliculas()
    });
  }

  cerrarModal() {
    this.peliculaSeleccionada = null;
    this.modoEdicion = false;
  }

  lanzarNotificacion(msg: string) {
    this.mensajeExito = msg;
    this.mostrarNotificacion = true;
    setTimeout(() => this.mostrarNotificacion = false, 3000);
  }
}