import { Component, Input, OnInit } from "@angular/core";
import { DatePipe } from '@angular/common';
import { HttpClient } from "@angular/common/http";
import { AngularFireDatabase } from '@angular/fire/database';

import { Observable } from 'rxjs';

import { ExcelService } from '../../services/excel.service';

@Component({
  selector: "app-assigned",
  templateUrl: "./assigned.component.html",
  styleUrls: ["./assigned.component.css"],
  providers: [DatePipe]
})
export class AssignedComponent implements OnInit {
  fullDevicesData: any[];
  assignedDevices: any[];
  unAssignedDevices: any[];
  fullDevicesLog: any[];

  items: any[];

  constructor(
    private db: AngularFireDatabase, 
    private http: HttpClient,
    private excelService: ExcelService,
    private datePipe: DatePipe
  ) {}

  ngOnInit() {
    this.db.list('devices')
      .snapshotChanges()
      .subscribe(devices => {
        this.fullDevicesData = devices.map(deviceSnapshot => {
          return { firebaseId: deviceSnapshot.key,  ...deviceSnapshot.payload.val() };
        });
        this.assignedDevices = this.fullDevicesData.filter(device => device.status === 'assigned');
        this.unAssignedDevices = this.fullDevicesData.filter(device => device.status === 'unassigned');
      });
  }

  markDeviceAsAssigned(employeeId, device) {
    const fieldsToUpdate = {
      status: 'assigned', 
      emp_id: employeeId,
      in_time: Date.now()
    }
    this.db.list('devices').update(device.firebaseId, {...fieldsToUpdate});
    this.addEventToTheCollection(device, fieldsToUpdate);
  }

  markDeviceAsUnassigned(device) {
    const fieldsToUpdate = {
      status: 'unassigned', 
      out_time: Date.now()
    }
    this.db.list('devices').update(device.firebaseId, { ...fieldsToUpdate });
    this.addEventToTheCollection(device, fieldsToUpdate);
  }

  private addEventToTheCollection(device, updatedFields) {

    const objectToPush = {
      ...device,
      ...updatedFields
    }

    this.db.list('events')
      .push(objectToPush);
  }

  downloadAsExcel():void {
    this.db.list('events').snapshotChanges().subscribe(devices => {
      let devicesEvent = devices.map(deviceSnapshot => {
          return { ...deviceSnapshot.payload.val() };
        });
        this.excelService.exportAsExcelFile(devicesEvent, `DeviceEvent ${this.datePipe.transform(Date.now(), 'dd-MM-yyyy hh:mm a')}`);
    });
  }
}
