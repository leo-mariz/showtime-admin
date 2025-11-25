export class GroupMemberEntity {
  artistUid?: string;
  isApproved: boolean;
  inviteStatus: number;
  isAdmin: boolean;

  constructor(init?: Partial<GroupMemberEntity>) {
    this.artistUid = init?.artistUid;
    this.inviteStatus = init?.inviteStatus ?? 0;
    this.isAdmin = init?.isAdmin ?? false;
    this.isApproved = init?.isApproved ?? false;
  }
} 