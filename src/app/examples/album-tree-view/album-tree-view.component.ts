import { Component } from '@angular/core';
import { GridDataProviderCallback, GridDataProviderParams } from '@vaadin/grid';
import '@vaadin/grid/vaadin-grid-tree-column.js';

@Component({
  selector: 'app-album-tree-view',
  templateUrl: './album-tree-view.component.html',
})
export class AlbumTreeViewComponent {
  dataProvider(
    { page, pageSize, parentItem }: GridDataProviderParams<any>,
    callback: GridDataProviderCallback<any>
  ) {
    if (!parentItem) {
      const start = page * pageSize;
      fetch(
        `https://jsonplaceholder.typicode.com/albums?_start=${start}&_limit=${pageSize}`
      )
        .then((response) => response.json())
        .then((albums) => {
          albums = albums.map((album: any) => ({
            ...album,
            albumTitle: album.title,
            hasChildren: true,
          }));
          callback(albums, 100);
        });
    } else {
      const albumId = parentItem.id;
      fetch(`https://jsonplaceholder.typicode.com/albums/${albumId}/photos`)
        .then((response) => response.json())
        .then((photos) => {
          photos = photos.map((photo: any) => ({
            ...photo,
            photoTitle: photo.title,
            hasChildren: false,
          }));
          callback(photos, photos.length);
        });
    }
  }
}
