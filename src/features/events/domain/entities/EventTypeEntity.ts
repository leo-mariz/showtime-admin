export class EventTypeEntity {
  constructor(
    public uid: string,
    public name: string,
    public active: boolean
  ) {}

  static defaultEventType(): EventTypeEntity {
    return new EventTypeEntity("", "", true);
  }
}
