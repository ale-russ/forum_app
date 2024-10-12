import React, { useEffect, useState } from "react";
import { Bar, Line } from "react-chartjs-2";
import Chart from "chart.js/auto";
import {
  Users,
  MessageSquare,
  FileText,
  Bell,
  Settings,
  ChevronDown,
  Search,
  Menu,
  X,
  Eye,
  Edit,
  Trash2,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import HomeWrapper from "../components/common/HomeWrapper";
import { useForum } from "../utils/PostContext";
import { getAdminDashboard } from "../controllers/DashboardController";

export default function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dashboardData, setDashboardData] = useState({});
  const { token, user } = useForum();

  const handleFetchData = async () => {
    const role = user.role;
    const response = await getAdminDashboard({ token, role });
    console.log("response: ");

    setDashboardData(response);
  };

  useEffect(() => {
    handleFetchData();
  }, []);

  console.log("Dashboard data: ", dashboardData);

  const contentActivityData = {
    labels: ["Posts", "Comments", "Likes", "Views"],
    datasets: [
      {
        label: "Activity Count",
        data: [
          dashboardData.postActivity?.length,
          dashboardData.commentActivity?.length,
          // dashboardData.contentActivity[1]?.length,
          3,
          5,
        ],
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(255, 206, 86, 0.2)",
          "rgba(75, 192, 192, 0.2)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  // Mock data for charts
  const userGrowthData = {
    labels: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    datasets: [
      {
        label: "New Users",
        data: [65, 59, 80, 81, 56, 55],
        fill: false,
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
    ],
  };
  return (
    <HomeWrapper
      children={
        <div className="flex light-navbar rounded shadow-lg">
          {/* Sidebar */}
          {/* <div
        className={`${
          sidebarOpen ? "block" : "hidden"
        } fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg md:relative md:block`}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold">KnowledgeChain Admin</h2>
          <button onClick={() => setSidebarOpen(false)} className="md:hidden">
            <X className="h-6 w-6" />
          </button>
        </div>
        <nav className="p-4">
          <ul className="space-y-2">
            <li>
              <a
                href="#"
                className="flex items-center p-2 text-gray-700 rounded hover:bg-gray-100"
              >
                <Users className="h-5 w-5 mr-3" />
                Users
              </a>
            </li>
            <li>
              <a
                href="#"
                className="flex items-center p-2 text-gray-700 rounded hover:bg-gray-100"
              >
                <MessageSquare className="h-5 w-5 mr-3" />
                Chat Rooms
              </a>
            </li>
            <li>
              <a
                href="#"
                className="flex items-center p-2 text-gray-700 rounded hover:bg-gray-100"
              >
                <FileText className="h-5 w-5 mr-3" />
                Posts
              </a>
            </li>
            <li>
              <a
                href="#"
                className="flex items-center p-2 text-gray-700 rounded hover:bg-gray-100"
              >
                <Bell className="h-5 w-5 mr-3" />
                Notifications
              </a>
            </li>
            <li>
              <a
                href="#"
                className="flex items-center p-2 text-gray-700 rounded hover:bg-gray-100"
              >
                <Settings className="h-5 w-5 mr-3" />
                Settings
              </a>
            </li>
          </ul>
        </nav>
      </div> */}

          {/* Main Content */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Dashboard Content */}
            <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
              <div className="container mx-auto px-6 py-8">
                <h3 className="text-3xl font-medium text-gray-700">
                  Dashboard
                </h3>

                <div className="mt-8">
                  {/* Stats */}
                  <div className="flex flex-wrap -mx-6">
                    <div className="w-full px-6 sm:w-1/2 xl:w-1/4">
                      <Card className="light-search shadow-lg">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                          <CardTitle className="text-sm font-medium">
                            Total Users
                          </CardTitle>
                          <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">
                            {dashboardData?.totalUsers?.length}
                          </div>
                          <p className="text-xs text-muted-foreground">
                            +2.5% from last month
                          </p>
                        </CardContent>
                      </Card>
                    </div>
                    <div className="w-full px-6 sm:w-1/2 xl:w-1/4 mt-4 sm:mt-0">
                      <Card className="light-search shadow-lg">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                          <CardTitle className="text-sm font-medium">
                            Active Chat Rooms
                          </CardTitle>
                          <MessageSquare className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">
                            {dashboardData?.chatRooms?.length}
                          </div>
                          <p className="text-xs text-muted-foreground">
                            +12% from last week
                          </p>
                        </CardContent>
                      </Card>
                    </div>
                    <div className="w-full px-6 sm:w-1/2 xl:w-1/4 mt-4 xl:mt-0">
                      <Card className="light-search shadow-lg">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                          <CardTitle className="text-sm font-medium">
                            New Posts
                          </CardTitle>
                          <FileText className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">
                            {dashboardData?.newPosts}
                          </div>
                          <p className="text-xs text-muted-foreground">
                            +8% from yesterday
                          </p>
                        </CardContent>
                      </Card>
                    </div>
                    <div className="w-full px-6 sm:w-1/2 xl:w-1/4 mt-4 xl:mt-0">
                      <Card className="light-search shadow-lg">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                          <CardTitle className="text-sm font-medium">
                            Reported Content
                          </CardTitle>
                          <Bell className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">
                            {dashboardData?.reportedContents}
                          </div>
                          <p className="text-xs text-muted-foreground">
                            -18% from last week
                          </p>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </div>

                <div className="mt-8">
                  {/* Charts */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <Card className="light-search shadow-lg">
                      <CardHeader>
                        <CardTitle>User Growth</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <Line data={userGrowthData} />
                      </CardContent>
                    </Card>
                    <Card className="light-search shadow-lg">
                      <CardHeader>
                        <CardTitle>Content Activity</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <Bar data={contentActivityData} />
                      </CardContent>
                    </Card>
                  </div>
                </div>

                <div className="mt-8">
                  {/* Recent Activity */}
                  <Card className="light-search shadow-lg">
                    <CardHeader>
                      <CardTitle>Recent Activity</CardTitle>
                      <CardDescription>
                        A list of recent actions and events on the platform
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>User</TableHead>
                            <TableHead>Action</TableHead>
                            <TableHead>Time</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          <TableRow>
                            <TableCell>John Doe</TableCell>
                            <TableCell>Created a new post</TableCell>
                            <TableCell>2 minutes ago</TableCell>
                            <TableCell>
                              <Button variant="ghost" size="sm">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>Jane Smith</TableCell>
                            <TableCell>Joined chat room "Tech Talk"</TableCell>
                            <TableCell>15 minutes ago</TableCell>
                            <TableCell>
                              <Button variant="ghost" size="sm">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>Mike Johnson</TableCell>
                            <TableCell>Reported a comment</TableCell>
                            <TableCell>1 hour ago</TableCell>
                            <TableCell>
                              <Button variant="ghost" size="sm">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </main>
          </div>
        </div>
      }
    />
  );
}
