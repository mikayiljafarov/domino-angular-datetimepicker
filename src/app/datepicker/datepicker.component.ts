import { Component, OnInit, OnChanges, Input, EventEmitter, Output, HostListener } from '@angular/core';
import * as moment from 'moment';

@Component({
    selector: 'datepicker-component',
    templateUrl: 'datepicker.component.html',
    styleUrls: ['./datepicker.component.scss']
})

export class DatepickerComponent implements OnInit, OnChanges {
    @Input() startYear: number = 1940;
    @Input() endYear: number = 2030;
    @Input('format') selectedFormat: string = 'DD/MM/YYYY';

    @Output() callbackDateSelected: EventEmitter<string> = new EventEmitter();

    @HostListener('document:click', ['$event']) hideCalendar(event) {
        if(!event.target.closest('.datepicker')) {
            this.calendarVisible = false;
        }
    }

    weekdays: string[] = [];

    selectedYear: number;
    selectedMonth: string = 'Jan';
    selectedDay: any = null;

    months: string[] = [];
    years: number[] = [];
    days: any[] = [];

    calendarVisible: boolean = false;

    constructor() {}

    ngOnInit() { 
        this.initWeekdays();
        this.initMonths();
        this.initYears();
        this.initDays();
    }

    ngOnChanges() {
        this.selectedYear = this.startYear;
    }

    initMonths() {
        this.months = moment.monthsShort();
    }

    initYears() {
        for(let i = this.startYear; i <= this.endYear; i++) {
            this.years.push(i);
        }
    }

    initWeekdays() {
        this.weekdays = moment.weekdaysShort();
        this.weekdays.push(this.weekdays.shift());
    }

    initDays() {
        this.getDaysOfMonth(this.selectedMonth, this.selectedYear);
    }

    getDaysOfMonth(month: string, year: number) {
        let daysOfPreviousMonth = this.getDaysOfPreviousMonth(month, year);
        let daysOfCurrentMonth = this.getDaysOfCurrentMonth(month, year);

        let previousAndCurrentDays = daysOfPreviousMonth.concat(daysOfCurrentMonth);
        
        let cicleCount = previousAndCurrentDays.length < 35 ? 2 : 1;

        let daysOfNextMonth = this.getDaysOfNextMonth(month, year, cicleCount);

        this.days = previousAndCurrentDays.concat(daysOfNextMonth);
    }

    getDaysOfPreviousMonth(month: string, year: number) {
        let previousMonthDays = [];

        let lastMondayOfPreviousMonth = moment().year(year).month(month).subtract(1, 'month').endOf('month');

        while(+lastMondayOfPreviousMonth.day() !== 1) {
            this.populateDaysArr(previousMonthDays, lastMondayOfPreviousMonth, 'previousMonth', 'sub');
        }

        this.populateDaysArr(previousMonthDays, lastMondayOfPreviousMonth, 'previousMonth', 'sub');

        previousMonthDays.sort(function(a, b) {
            return a.date-b.date;
        });

        return previousMonthDays;
    }

    getDaysOfCurrentMonth(month: string, year: number) {
        let currentMonthDays = [];

        let startOfCurrentMonth = moment().year(year).month(month).startOf('month');
        
        do {
            this.populateDaysArr(currentMonthDays, startOfCurrentMonth, 'currentMonth', 'add');
        } while(+startOfCurrentMonth.format('D') != 1);

        return currentMonthDays;
    }

    getDaysOfNextMonth(month: string, year: number, cicleCount: number) {
        let nextMonthDays = [];

        let startOfNextMonth = moment().year(year).month(month).add(1, 'month').startOf('month');

        for(let i = 0; i < cicleCount; i++) {
            while(startOfNextMonth.day() !== 0) {
                this.populateDaysArr(nextMonthDays, startOfNextMonth, 'nextMonth', 'add');
            }

            this.populateDaysArr(nextMonthDays, startOfNextMonth, 'nextMonth', 'add');
        }

        return nextMonthDays;
    }

    populateDaysArr(arr: any[], momentDate: any, status: string, operation: string) {
        arr.push({
            date: +momentDate.format('D'),
            month: momentDate.format('MMM'),
            year: +momentDate.format('YYYY'),
            fullDate: momentDate.format(this.selectedFormat),
            status: status
        });

        if(operation == 'sub') {
            momentDate.subtract(1, 'day');
        }
        else if(operation == 'add') {
            momentDate.add(1, 'day');
        }
    }

    // Event Handlers
    selectDate(date: any) {
        if(date.year < this.startYear || date.year > this.endYear) return;

        this.selectedDay = date;
        this.callbackDateSelected.emit(this.selectedDay.fullDate);
        
        this.calendarVisible = false;
    }

    callbackMonthChanged(selectedMonth: string) {
        this.selectedMonth = selectedMonth;

        this.getDaysOfMonth(this.selectedMonth, this.selectedYear);
    }

    callbackYearChanged(selectedYear: string) {
        this.selectedYear = +selectedYear;

        this.getDaysOfMonth(this.selectedMonth, this.selectedYear);
    }

    selectPreviousMonth(monthSelector: HTMLSelectElement, yearSelector: HTMLSelectElement) {
        if(monthSelector.selectedIndex == 0) {
            monthSelector.selectedIndex = 11;
            this.selectedMonth = monthSelector.value;

            if(yearSelector.selectedIndex != 0) {
                --yearSelector.selectedIndex;
                this.selectedYear = +yearSelector.value;
            }
        }
        else {
            --monthSelector.selectedIndex;
            this.selectedMonth = monthSelector.value;
        }

        this.getDaysOfMonth(this.selectedMonth, this.selectedYear);
    }

    selectNextMonth(monthSelector: HTMLSelectElement, yearSelector: HTMLSelectElement) {
        let yearOptionsLength = yearSelector.options.length;

        if(monthSelector.selectedIndex == 11) {
            monthSelector.selectedIndex = 0;
            this.selectedMonth = monthSelector.value;

            if(yearSelector.selectedIndex != yearOptionsLength - 1) {
                ++yearSelector.selectedIndex;
                this.selectedYear = +yearSelector.value;
            }
        }
        else {
            ++monthSelector.selectedIndex;
            this.selectedMonth = monthSelector.value;
        }

        this.getDaysOfMonth(this.selectedMonth, this.selectedYear);
    }

    showCalendar() {
        this.calendarVisible = true;
        
        if(this.selectedDay) {
            this.selectedMonth = this.selectedDay.month;
            this.selectedYear = this.selectedDay.year;

            this.getDaysOfMonth(this.selectedMonth, this.selectedYear);
        }
    }
}