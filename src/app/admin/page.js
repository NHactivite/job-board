import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Briefcase,
  Users,
  FileText,
  TrendingUp,
  DollarSign,
  AlertTriangle,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  fetchAllProfileAction,
  fetchJobApplicationAction,
  fetchJobsForCandidateAction,
  fetchPlanAction,
  getMembershipUsers,
} from "@/actions";

export default async function AdminDashboardPage() {
  const TotalJobs = await fetchJobsForCandidateAction({});
  const TotalUsers = await fetchAllProfileAction({});
  const TotalApplications = await fetchJobApplicationAction({});
  const TotalRevenu = await getMembershipUsers({});
  const AllPlan = await fetchPlanAction();

  console.log(AllPlan);
  AllPlan.map((item) => {
    console.log(item.type);
  });
 
  const clculateRevenue = (allPlan, key) => {
    const membershipTypes = key.map((r) => r.memberShipType);
    return allPlan.reduce((acc, item) => {
      if (membershipTypes.includes(item.type)) {
        return acc + item.price;
      }
      return acc;
    }, 0);
  };

  const totalRevenu = clculateRevenue(AllPlan, TotalRevenu);

  return (
    <div className="flex flex-col gap-6 p-4 md:p-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        <p >
          Overview of the platform's performance and activity
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Jobs</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{TotalJobs.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{TotalUsers.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Applications</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{TotalApplications.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalRevenu}</div>
          </CardContent>
        </Card>
      </div>

        <Card>
          <CardHeader>
            <CardTitle>Membership Plans</CardTitle>
            <CardDescription>
              Distribution of active subscription plans
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex-col items-center justify-between">
              {  
              AllPlan.map((item)=>{
                return(
                  <div key={item.id} className="flex items-center justify-between mx-4 p-4">
                    
                    <p className="text-sm font-medium">{item.type}</p>
                    <p className="text-sm text-muted-foreground">₹{item.price}</p>
                    </div>
                  
                )
                })
              }
              </div>
            </div>
            <div className="mt-4">
              <Link  href="/admin/plan">
                <Button variant="outline" size="sm" className="w-full">
                  Manage Plans
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        
      
    </div>
  );
}
