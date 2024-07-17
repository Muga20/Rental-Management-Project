export interface HomeProfile {
  id: string;
  name: string;
  slug: string;
  email: string;
  phone: string;
  location: string;
  images: string;
  houseCategory: string;
  stories: string;
  status: string;
  description: string | null;
  rentPaymentDay: string | null;
  landlord_id: string;
  agent_id: string;
  company_id: string;
  units_count: number;
}

export interface Company {
  id: any;
  companyId: number;
  logoImage: string;
  name: string;
  phone: string;
  location: string;
  users_count: number;
  status: string;
}

export interface UserDetails {
  profileImage: string;
  first_name: string;
  middle_name?: string;
  last_name: string;
  description: string;
  username: string;
  date_of_birth?: Date;
  id_number?: string;
  location: string;
  address: string;
  about_the_user: string;
  gender: string;
  coverPhoto: string;
  created_at:Date;
}

export interface AgentUser {
  id: string;
  email: string;
  phone_no: string;
  status: string;
  authType: string;
  last_login_at: string | null;
  two_fa_status: string | null;
  company_id: string;
  detail: UserDetails;
}

export interface ApiResponse {
  home: HomeProfile;
  vacantUnits: number;
  agentUsers: AgentUser[];
  careTakers: AgentUser[]; 
}

export interface Role {
  id: string;
  name: string;
  color: string;
  status:string;
  users_count: number;
}

export interface UserData {
  roles: any;
  authType: string;
  id: string;
  email?: string;
  password: string;
  status?: string;
  detail: UserDetails;
  two_fa_status?: string;
  phone_no?: string;
  company?: Company;
}

export interface Channel {
  id: string;
  channel_name: string;
  event: string;
  channel_id: number;
}

export interface UsersProps {
  selectedRole: string;
  searchQuery: string;
  status: string; 
}

export interface User {
  id: string;
  email: string;
  created_at?: Date;
  status: string;
  detail: UserDetails;
  company: Company;
  roles: Role[]; 
}

export interface Plan {
  id: string;
  number_of_homes: number;
  plan_name: string;
  price: number;
  number_of_agents: number;
  duration: string;
  status:string;
}

export interface Payment {
  id: string;
  slug: string;
  name: string;
  status: string;
}

export interface PaymentChannel {
  id: string;
  channel_name: string;
  channel_logo: string;
  payment_type_id: number;
  status: string;
  payment_type : Payment;
}

export interface Section {
  id: string;
  name: string;
  component: JSX.Element;
}

export interface SubscribedCompanies {
  companyId: number;
  logoImage: string;
  name: string;
  phone: string;
  location: string;
  users_count: number;
  status: string;
  transactionStatus: string;
  plan_name: string;
  price: number;
  amount_paid: number;
  confirmationCode: string;
  transactionDate: string;
}

export interface Unit {
  id:string ;
  unit_name: string;
  number_of_rooms: number;
  payableRent: number;
  payableWaterBill:number;
  payableGarbageBill:number;
  previousMeterReading: number;
  paymentPeriod: string;
  lastWaterBill: number;
  currentMeterReading: number;
  damages: string;
  user_id: string;
  home_id: string;
  dateOfOccupation: string;
  slug: string;
  status: string;
  isPaid: boolean;
  lastGarbageBill: number;
}


export interface Lease {
  id:string;
  unit_id: string;
  user_id: string;
  start_date: string;
  end_date: string;
  rent_deposit: number;
  additional_fees: number;
}

