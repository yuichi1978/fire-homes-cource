import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import FiltersForm from "@/app/property-search/filters-form";

export default function PropertySearch() {
  return (
    <div className="max-w-screen-lg mx-auto">
      <h1 className="text-5xl font-bold p-5">Property Search</h1>
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <FiltersForm />
        </CardContent>
      </Card>
    </div>
  );
}
