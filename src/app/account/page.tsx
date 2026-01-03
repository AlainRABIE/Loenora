import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { orders } from "@/lib/data";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { OrderStatus } from "@/lib/types";

const statusColors: Record<OrderStatus, string> = {
    Pending: "bg-yellow-500",
    Processing: "bg-blue-500",
    Shipped: "bg-green-500",
    Delivered: "bg-gray-500",
    Cancelled: "bg-red-500"
}

export default function AccountPage() {
    const userOrders = orders.slice(0, 3); // Mock: show first 3 orders for this user

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl md:text-4xl font-bold mb-8">My Account</h1>
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle>Order History</CardTitle>
                    <CardDescription>View your past orders and their status.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-6">
                        {userOrders.map(order => (
                            <div key={order.id} className="p-4 border rounded-lg flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                                <div className="space-y-1">
                                    <p className="font-semibold">Order #{order.id}</p>
                                    <p className="text-sm text-muted-foreground">Date: {order.date}</p>
                                    <p className="text-sm text-muted-foreground">Total: ${order.total.toFixed(2)}</p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <Badge variant="secondary" className="flex items-center gap-2">
                                        <span className={`h-2 w-2 rounded-full ${statusColors[order.status]}`}></span>
                                        {order.status}
                                    </Badge>
                                    <Button variant="outline" size="sm" asChild>
                                        <Link href="#">View Details</Link>
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
                <CardFooter>
                    <Button variant="secondary">View All Orders</Button>
                </CardFooter>
            </Card>
        </div>

        <div>
            <Card>
                <CardHeader>
                    <CardTitle>Account Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-sm">
                    <div className="font-medium">
                        <p>Alice Johnson</p>
                        <p className="text-muted-foreground">alice@example.com</p>
                    </div>
                    <Separator/>
                    <div>
                        <p className="font-medium">Shipping Address</p>
                        <p className="text-muted-foreground">
                            123 Main St<br/>
                            Anytown, USA 12345
                        </p>
                    </div>
                </CardContent>
                <CardFooter className="flex gap-2">
                    <Button>Edit Profile</Button>
                    <Button variant="outline">Log Out</Button>
                </CardFooter>
            </Card>
        </div>
      </div>
    </div>
  );
}
