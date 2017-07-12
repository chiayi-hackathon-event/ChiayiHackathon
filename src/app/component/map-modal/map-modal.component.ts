import { Component, Input, NgZone, OnInit, NgModule } from '@angular/core';

import { BrowserModule } from '@angular/platform-browser';
import { AgmCoreModule, MapsAPILoader, GoogleMapsAPIWrapper, AgmDataLayer } from '@agm/core';

import { GMapsService } from '../../service/gmaps.service';
import { LayerService } from '../../service/layer.service';

import { Marker } from '../../class/marker';

declare var google: any;
declare var jquery: any;
declare var $: any;
declare var Slider: any;

@Component({
  selector: 'app-map-modal',
  templateUrl: './map-modal.component.html',
  styleUrls: ['./map-modal.component.css'],
  providers: [GMapsService, LayerService, Marker]
})
export class MapModalComponent implements OnInit {

  lat: number = 23.4791187;
  lng: number = 120.44113820000007;
  radius: number = 50000;
  color: string = '#FECE00';
  addr: string = "̨嘉義火車站";
  geoJsonObject: Object = null;
  timelineValue: number = 46;
  value: number = 0;
  constructor(
    private gmapService: GMapsService,
    private layerService: LayerService,
    private zone: NgZone,
    private marker: Marker
  ) { }

  ngOnInit() {

    this.getLayer();

    // With JQuery
    $("#timeline").slider().on("slide", function (slideEvt) {
      $("#ex6SliderVal").text(slideEvt.value);
    }).on("change", function (slideEvt) {
      $("#ex6SliderVal").text(slideEvt.value.newValue);
    });

  }

  async setCircle() {
    await this.gmapService.getLatLan(this.addr)
      .subscribe(
      result => {
        //必須使用zone 觀察整個 view 否則會導致延遲
        this.zone.run(() => {
          this.lat = result.lat();
          this.lng = result.lng();
          this.saveMarker(result.lat(), result.lng());
        });
      },
      error => console.log(error),
      () => console.log('Geocoding completed!')
      );
  }

  saveMarker(lat: number, lng: number) {
    this.marker.lat = lat;
    this.marker.lng = lng;
  }

  async getLayer() {
    await this.layerService.getTaiwanLayer()
      .subscribe(
      result => {
        this.zone.run(() => {
          this.geoJsonObject = result;
        });
      },
      error => {
        console.log(error);
      });
  }

  styleFunc(feature) {
    // get level - 0/1
    //var level = feature.getProperty('level');
    var color = 'green';
    // only show level one features
    //var visibility = level == 1 ? true : false;
    return {
      icon: 'assets/images/door.png',
      fillColor: color,
      fillOpacity: 0.2,
      strokeColor: color,
      strokeWeight: 1,
      strokeOpacity: 0.8,
      // make layer 1 features visible
      // visible: visibility
    };
  }

}