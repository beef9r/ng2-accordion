import {
    Component,
    Input,
    Host,
    forwardRef,
    Inject,
    ContentChild,
    ElementRef,
    ChangeDetectorRef,
    Output,
    EventEmitter,
    trigger,
    animate,
    transition,
    style
} from "@angular/core";
import {Accordion} from "./Accordion";
import {AccordionToggle} from "./AccordionToggle";

@Component({
    selector: "accordion-group",
  animations: [
    trigger('collapse', [
      transition(':enter', [
        style({height: 0}),
        animate('300ms ease-out', style({height: '*'}))
      ]),
      transition(':leave', [
        style({height: '*'}),
        animate('300ms ease-out', style({height: 0}))
      ])
    ]),
    trigger('fade', [
      transition(':enter', [
        style({transform: 'translateY(20%)', opacity: 0}),
        animate('200ms 100ms ease-out', style({transform: 'translateY(0)', opacity: 1}))
      ]),
      transition(':leave', [
        style({transform: 'translateY(0)', opacity: 1}),
        animate('300ms', style({transform: 'translateY(20%)', opacity: 0}))
      ])
    ])
  ],
  styleUrls: ['./Accordion.css'],
    template: `
  <div class="panel panel-default" [class.dropup]="isOpened" [class.disabled]="disabled">
    <div class="panel-heading" role="tab" (click)="checkAndToggle()">
      <h4 class="panel-title">
        <a *ngIf="heading" role="button" data-toggle="collapse" [attr.aria-expanded]="isOpened">
            {{ heading }}
        </a>
        <ng-content select="accordion-heading"></ng-content>
        <div class="caret" [style.display]="accordion.showArrows ? '' : 'none'">
          &#94;
        </div>
      </h4>
    </div>
    <div *ngIf="isOpened"  [@collapse]="isOpened" class="panel-collapse collapse in" role="tabpanel" [attr.aria-labelledby]="heading">
      <div class="panel-body" [@fade]="isOpened">
        <ng-content></ng-content>
      </div>
    </div>
  </div>
`
})
export class AccordionGroup {

    @Input()
    heading: string;

    @Input()
    isOpened: boolean = false;

    @Output()
    onOpen = new EventEmitter();

    @Output()
    onClose = new EventEmitter();

    @Output()
    onToggle = new EventEmitter();

    @ContentChild(AccordionToggle)
    toggler: ElementRef;

    @Input()
    disabled: boolean = false;

    constructor(@Host() @Inject(forwardRef(() => Accordion)) public accordion: Accordion,
                private cdr: ChangeDetectorRef) {
    }

    checkAndToggle() {
        // if custom toggle element is supplied, then do nothing, custom toggler will take care of it
        if (this.toggler)
            return;

        this.toggle();
    }

    toggle() {
        if (this.disabled)
            return;

        const isOpenedBeforeWeChange = this.isOpened;
        if (this.accordion.closeOthers)
            this.accordion.closeAll();

        this.isOpened = !isOpenedBeforeWeChange;
        if (this.isOpened) {
            this.onOpen.emit();
        } else {
            this.onClose.emit();
        }
        this.onToggle.emit(this.isOpened);
    }

    openOnInitialization() {
        this.isOpened = true;
        this.cdr.detectChanges();
    }

}