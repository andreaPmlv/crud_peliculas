import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class AppComponent {
  peliculas = [
    { id: 1, titulo: 'Jujutsu Kaisen', sinopsis: 'Jujutsu Kaisen sigue a Yuuji Itadori, un estudiante con fuerza física excepcional que, para salvar a sus amigos, ingiere un objeto maldito de grado especial: un dedo del temido Ryomen Sukuna. Al convertirse en el recipiente de Sukuna, Itadori entra al peligroso mundo de la hechicería para encontrar y comer los 20 dedos restantes antes de ser ejecutado. ', poster: 'juju.jpg', calificacion: 5 },
    { id: 2, titulo: 'Super Mario Bros.', sinopsis: 'sigue a Mario y Luigi, fontaneros de Brooklyn que terminan en un mundo mágico tras investigar una tubería. Al separarse, Mario une fuerzas con la Princesa Peach y Toad para rescatar a Luigi del malvado Rey Bowser, quien amenaza con destruir el Reino Champiñón con una superestrella', poster: 'mario.jpg', calificacion: 5 }
  ];

  peliculaSeleccionada: any = null;
  modoEdicion: boolean = false;
  imagenTemporal: string = '';

  // Función para el ojito
  verSoloDetalles(peli: any) {
    this.peliculaSeleccionada = { ...peli };
    this.modoEdicion = false;
  }

  // Función para Editar
  abrirEditor(peli: any) {
    this.peliculaSeleccionada = { ...peli };
    this.modoEdicion = true;
  }

  cerrarModal() {
    this.peliculaSeleccionada = null;
    this.modoEdicion = false;
    this.imagenTemporal = '';
  }

  //imagen desde la PC
  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagenTemporal = e.target.result;
        if (this.modoEdicion && this.peliculaSeleccionada) {
          this.peliculaSeleccionada.poster = e.target.result;
        }
      };
      reader.readAsDataURL(file);
    }
  }

  guardarEdicion() {
    const index = this.peliculas.findIndex(p => p.id === this.peliculaSeleccionada.id);
    if (index !== -1) {
      this.peliculas[index] = this.peliculaSeleccionada;
    }
    this.cerrarModal();
  }

  agregarConDatos(titulo: string, sinopsis: string) {
    if (!titulo) return;
    const nuevaPeli = {
      id: this.peliculas.length + 1,
      titulo: titulo,
      sinopsis: sinopsis,
      poster: this.imagenTemporal || 'https://via.placeholder.com/150', 
      calificacion: 1
    };
    this.peliculas.push(nuevaPeli);
    this.imagenTemporal = ''; 
  }

  eliminarPelicula(id: number) {
    this.peliculas = this.peliculas.filter(p => p.id !== id);
  }

  calificar(peli: any, nota: number) {
    peli.calificacion = nota;
  }
}