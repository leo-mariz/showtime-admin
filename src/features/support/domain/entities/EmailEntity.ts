export class EmailEntity {
  id?: string;
  key?: string;
  fullName?: string;
  from?: string;
  to?: string[];
  subject: string;
  body: string;
  isHtml: boolean;
  attachment?: string;
  status?: string;
  createdAt?: Date;
  updatedAt?: Date;

  constructor(init: {
    id?: string;
    key?: string;
    fullName?: string;
    from?: string;
    to?: string[];
    subject: string;
    body: string;
    isHtml?: boolean;
    attachment?: string;
    status?: string;
    createdAt?: Date;
    updatedAt?: Date;
  }) {
    this.id = init.id;
    this.key = init.key;
    this.fullName = init.fullName;
    this.from = init.from;
    this.to = init.to;
    this.subject = init.subject;
    this.body = init.body;
    this.isHtml = init.isHtml ?? false;
    this.attachment = init.attachment;
    this.status = init.status;
    this.createdAt = init.createdAt;
    this.updatedAt = init.updatedAt;
  }
} 