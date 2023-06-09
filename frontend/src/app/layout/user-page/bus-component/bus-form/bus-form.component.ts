import { Component, EventEmitter, Input, Output } from "@angular/core";
import { UntypedFormGroup } from "@angular/forms";
import { take } from "rxjs";
import { ManageService } from "src/app/services/manage.service";
import { NotificationService } from "src/app/services/notification.service";

@Component({
    selector: "app-buses-form",
    templateUrl: "./bus-form.component.html",
    styleUrls: ["./bus-form.component.css"]
})

export class BusesFormComponent {
    @Input() form?: UntypedFormGroup;
    @Input() mode?: "create" | "edit";
    @Output() closeEmitter: EventEmitter<void> = new EventEmitter<void>();

    constructor(private manageService: ManageService, private _notificationSvc: NotificationService) { }

    public update(formValue: any): void {
        this.manageService.updateBus(formValue).pipe(take(1)).subscribe(() => {
            this._notificationSvc.success("Editing success", "Data saved",3000);
            this.close();
        },(err) => {
            this._notificationSvc.error("Editing failed", err.error.error,3000);
            
            
        })
        
    }

    public add(formValue: any): void {
        this.manageService.addBus(formValue).pipe(take(1)).subscribe(() => {
            this._notificationSvc.success("Adding success", "Data saved",3000);
            this.close();
        },(err) => {
            this._notificationSvc.error("Adding failed", err.error.error,3000);
            
        });
    }

    public close() {
        this.closeEmitter.emit();
    }
}