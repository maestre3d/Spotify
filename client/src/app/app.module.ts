import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { routing, appRoutingProviders } from './app.routing';

import { AppComponent } from './app.component';
import { UserEditComponent } from './components/user-edit.component';
import { ArtistListComponent } from './components/artist-list.component';
import { HomeComponent } from './components/home.component';
import { ArtistAddComponent } from './components/artist-add.component';
import { ArtistEditComponent } from './components/artist-edit.component';
import { ArtistDetailComponent } from './components/artist-detail.component';

import { AlbumAddComponent } from './components/album-add.component';
import { AlbumEditComponent } from './components/album-edit.component';

@NgModule({
  // Load components and directives
  declarations: [
    AppComponent,
    UserEditComponent,
    ArtistListComponent,
    HomeComponent,
    ArtistAddComponent,
    ArtistEditComponent,
    ArtistDetailComponent,
    AlbumAddComponent,
    AlbumEditComponent
  ],
  // Load modules
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    routing
  ],
  // Load services
  providers: [appRoutingProviders],
  // App's loading Point
  bootstrap: [AppComponent]
})
export class AppModule { }
