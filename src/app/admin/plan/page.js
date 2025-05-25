import { fetchPlanAction } from "@/actions";
import Plan from "@/components/plan/page";

 export default async function PlansPage() {
        const result =await  fetchPlanAction();
        console.log(result)
    
  return (
    <Plan data={JSON.parse(JSON.stringify(result))}/>
  )
}
