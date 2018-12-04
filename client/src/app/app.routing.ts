// Router modules
import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Import home
import { HomeComponent } from './components/home.component';
// Import user
import { UserEditComponent } from './components/user-edit.component';
// Import artist
import { ArtistListComponent } from './components/artist-list.component';
import { ArtistAddComponent } from './components/artist-add.component';
import { ArtistEditComponent } from './components/artist-edit.component';
import { ArtistDetailComponent } from './components/artist-detail.component';

// Import album
import { AlbumAddComponent } from './components/album-add.component';
import { AlbumEditComponent } from './components/album-edit.component';

// Array w all routes config
const appRoutes: Routes = [
    // Default route, loads component
    /* {
        path: '',
        redirectTo: '/home',
        pathMatch: 'full'
    }, */
    {path: '', component: HomeComponent},
    {path: 'artists/:page', component: ArtistListComponent},
    {path: 'new-artist', component: ArtistAddComponent},
    {path: 'edit-artist/:id', component: ArtistEditComponent},
    {path: 'artist/:id', component: ArtistDetailComponent},
    {path: 'create-album/:artist', component: AlbumAddComponent},
    {path: 'edit-album/:id', component: AlbumEditComponent},
    {path: 'user-data', component: UserEditComponent},
    // 404 not found page
    {path: '**', component: HomeComponent}
];

// Export route config and module
export const appRoutingProviders: any[] = [];
export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
