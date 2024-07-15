import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { getApiLimit } from "@/lib/api-limit";

const DashboardLayout = async ({ children }: { children: React.ReactNode }) => {
  const apiLimit =  await getApiLimit();
  return (
    <div className="h-full relative">
      <div className="hidden h-full md:flex md:w-72 md:flex-col md:fixed md:inset-y-0 z-[80] bg-gray-900">
        <Sidebar apiLimit={apiLimit} />
      </div>
      <div>
        <main className="md:pl-72">
          <Navbar /> {children}
        </main>
      </div>
    </div>
  );
};
export default DashboardLayout;
