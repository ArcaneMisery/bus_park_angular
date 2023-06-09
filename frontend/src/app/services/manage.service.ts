import { Injectable } from "@angular/core";
import { BackendService } from "./backend.service";
import { BehaviorSubject, Observable, take, tap } from "rxjs";
import { BookTicket, Bus, Driver, Journey, Login, Register, Ticket, Timetable, Trip, userForm } from "../interfaces/core.interfaces";
import { CookieService } from "ngx-cookie-service";


@Injectable()
export class ManageService {
    public userInfo$: BehaviorSubject<{ login: string; role: string } | null> = new BehaviorSubject<{ login: string; role: string } | null>(null);
    public _isLoggedIn$: BehaviorSubject<boolean> = new BehaviorSubject(false);

    constructor(
        private readonly backendService:  BackendService,
        private cookieService: CookieService
    ) {

    }

    public login(userData: Login): Observable<any> {
        const data = {login:userData.username, password:userData.password};
        this._isLoggedIn$.next(true);
        return this.backendService.auth.login$(data).pipe(
            tap((data: any) => {
                this.cookieService.set("accesstoken",`${data.accessToken}`);
                this.cookieService.set("role",`${data.role}`);
                this._isLoggedIn$.next(true);
            })
        );
    }

    public logout(): Observable<any> {
        return this.backendService.auth.logout$().pipe(
            tap(() => {
            this.cookieService.delete("accesstoken");
            this.cookieService.delete("role");
            this._isLoggedIn$.next(false);
        }));
    }

    public register(userData: Register): Observable<any> {
        const data = {login:userData.username,password:userData.password,full_name:userData.fullName,phone_number:userData.phone};
        return this.backendService.auth.register$(data);
    }

    public refresh(token: string): Observable<any> {
        const role = this.cookieService.get("role");
        return this.backendService.auth.refresh$(token, role).pipe(
            tap((data) => {
                this._isLoggedIn$.next(true);
                this.userInfo$.next({role: data.role, login: data.login});
                this.cookieService.delete("accesstoken");
                this.cookieService.set("accesstoken", data.accessToken);
                console.log("refresh success in back service");
            }, (err) => {
                throw err;
            })
        )
    }

    public bookTickets(bookTicket: BookTicket): Observable<any> {
        const data = {
            ...bookTicket,
            login: bookTicket.username
        };
        return this.backendService.bookings.bookingTickets$(data);
    }

    public getArrivalPoints(): Observable<any> {
        return this.backendService.getInfo.getArrivalPoints$();
    }

    public getTicketPrice(arrival_point:string,journey_date:string): Observable<any> {
        return this.backendService.getInfo.getTicketPrice$(arrival_point,journey_date);
    }

    public getQuantityOfFreeSeats(arrival_point:string,journey_date:string): Observable<any> {
        return this.backendService.getInfo.getQuantityOfFreeSeats$(arrival_point,journey_date);
    }
    
    public getUserInfo(): Observable<any> {
        return this.backendService.user.getUserInfo$();
    }

    public getAllUsers(): Observable<any> {
        return this.backendService.user.getAllUsers$();
    }

    public getBookingInfo(): Observable<any> {
        return this.backendService.bookings.getBookingInfo$();
    }

    public getUnpaidTickets(): Observable<any> {
        return this.backendService.tickets.getUnpaidTickets$();
    }

    public deleteBooking(booking_id: number): Observable<any> {
        return this.backendService.bookings.deleteBooking$(booking_id);
    }

    public deleteUser(user_id: number): Observable<any> {
        return this.backendService.user.deleteUser$(user_id);
    }

    public changeUserData(userData: userForm): Observable<any> {
        const data = {login:userData.username, password: userData.password,new_password:userData.new_password,full_name:userData.fullName,phone_number:userData.phone};
        return this.backendService.user.changeUserData$(data);
    }

    public signUpUserForAdmin (userData: userForm): Observable<any> {
        const data = {login:userData.username, password: userData.password,full_name:userData.fullName,phone_number:userData.phone , category:userData.role };
        return this.backendService.user.signUpUserForAdmin$(data);
    }

    public updateUserForAdmin (userData: userForm): Observable<any> {
        const data = {login:userData.username, password: userData.password,full_name:userData.fullName,phone_number:userData.phone , category:userData.role };
        return this.backendService.user.updateUserForAdmin$(data);
    }
    
    public sellTicket(ticket_id: number): Observable<any> {
        return this.backendService.tickets.sellTicket$(ticket_id);
    }

    public addTicket(ticketData: Ticket): Observable<any> {
        return this.backendService.tickets.addTicket$(ticketData);
    }

    public getAllTrips(): Observable<any> {
        return this.backendService.trip.getAllTrips$();
    }

    public addTrip(trip: Trip): Observable<any> {
        return this.backendService.trip.addTrip$(trip);
    }

    public deleteTrip(id: number): Observable<any> {
        return this.backendService.trip.deleteTrip$(id);
    }

    public updateTrip(trip: Trip): Observable<any> {
        return this.backendService.trip.updateTrip$(trip);
    }

    public getAllBuses(): Observable<any> {
        return this.backendService.bus.getAllBuses$();
    }

    public updateBus(bus:Bus): Observable<any> {
        return this.backendService.bus.updateBus$(bus);
    }

    public deleteBus(id:number): Observable<any> {
        return this.backendService.bus.deleteBus$(id);
    }

    public addBus(bus:Bus): Observable<any> {
        return this.backendService.bus.addBus$(bus);
    }

    public getAllDrivers(): Observable<any> {
        return this.backendService.driver.getAllDrivers$();
    }

    public updateDriver(driver:Driver): Observable<any> {
        return this.backendService.driver.updateDriver$(driver);
    }

    public deleteDriver(id:number): Observable<any> {
        return this.backendService.driver.deleteDriver$(id);
    }

    public addDriver(driver:Driver): Observable<any> {
        return this.backendService.driver.addDriver$(driver);
    }

    public addTimetable(timetable:Timetable): Observable<any> {
        return this.backendService.timetable.addTimetable$(timetable);
    }

    public getAllTimetables(): Observable<any> {
        return this.backendService.timetable.getAllTimetables$();
    }

    public updateTimetable(timetable:Timetable): Observable<any> {
        return this.backendService.timetable.updateTimetable$(timetable);
    }

    public getAllJourneys(): Observable<any> {
        return this.backendService.journey.getAllJourneys$();
    }

    public updateJourney(journey:Journey): Observable<any> {
        return this.backendService.journey.updateJourney$(journey);
    }

    public deleteJourney(id:number): Observable<any> {
        return this.backendService.journey.deleteJourney$(id);
    }

    public addJourney(journey:Journey): Observable<any> {
        return this.backendService.journey.addJourney$(journey);
    }

    public cancelJourney(id:number): Observable<any> {
        return this.backendService.journey.cancelJourney$(id);
    }

    
    //statistics
    public busInTrip(bus_number:string, start_date: string, end_date: string): Observable<any> {
        return this.backendService.statistics.busInTrip$(bus_number, start_date, end_date)
    }

    public sumTicketsOnTrip(trip_number:string, start_date:string, end_date:string): Observable<any> {
        return this.backendService.statistics.sumTicketsOnTrip$(trip_number, start_date, end_date)
    }

    public difBookedAndPaid(trip_number:string, start_date:string, end_date:string): Observable<any> {
        return this.backendService.statistics.difBookedAndPaid$(trip_number, start_date, end_date)
    }
}

