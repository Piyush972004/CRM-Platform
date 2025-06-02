
export interface Rule {
  id: string;
  field: string;
  operator: string;
  value: string;
  logicalOperator?: 'AND' | 'OR';
  [key: string]: string | undefined; // Add index signature for Json compatibility
}

export interface Audience {
  id: string;
  name: string;
  size: number;
  rules: Rule[];
  createdAt: string;
}

export interface Campaign {
  id: string;
  name: string;
  audience: string;
  audienceSize: number;
  sent: number;
  delivered: number;
  failed: number;
  deliveryRate: string;
  status: 'Active' | 'Completed' | 'Draft';
  createdAt: string;
  objective: string;
  message: string;
}

export interface CommunicationLog {
  id: string;
  campaignId: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  message: string;
  status: 'SENT' | 'FAILED' | 'PENDING';
  deliveredAt?: string;
  failureReason?: string;
  vendorResponse?: string;
}
