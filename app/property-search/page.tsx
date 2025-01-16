import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import FiltersForm from "@/app/property-search/filters-form";
import { Suspense } from "react";
import { getProperties } from "@/data/properties";
import Image from "next/image";
import imageUrlFormatter from "@/lib/imageUrlFormatter";
import { BathIcon, BedIcon, HomeIcon } from "lucide-react";
import numeral from "numeral";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import ToggleFavouritesButton from "@/app/property-search/toggle-favourites-button";
import { cookies } from "next/headers";
import { auth } from "@/firebase/server";
import { DecodedIdToken } from "firebase-admin/auth";
import { getUserFavourites } from "@/data/favourites";

export default async function PropertySearch({
  searchParams,
}: {
  searchParams: Promise<any>;
}) {
  const searchParamsValues = await searchParams;

  const parsedPage = parseInt(searchParamsValues?.page);
  const parsedMinPrice = parseInt(searchParamsValues?.minPrice);
  const parsedMaxPrice = parseInt(searchParamsValues?.maxPrice);
  const parsedMinBedrooms = parseInt(searchParamsValues?.minBedrooms);

  const page = isNaN(parsedPage) ? 1 : parsedPage;
  const minPrice = isNaN(parsedMinPrice) ? null : parsedMinPrice;
  const maxPrice = isNaN(parsedMaxPrice) ? null : parsedMaxPrice;
  const minBedrooms = isNaN(parsedMinBedrooms) ? null : parsedMinBedrooms;

  const { data, totalPages } = await getProperties({
    pagination: {
      page,
      pageSize: 3,
    },
    filters: {
      minPrice,
      maxPrice,
      minBedrooms,
      status: ["for-sale"],
    },
  });

  const userFavourites = await getUserFavourites();

  console.log({ userFavourites });

  const cookieStore = await cookies();
  const token = cookieStore.get("firebaseAuthToken")?.value;
  let verifiedToken: DecodedIdToken | null;

  if (token) {
    verifiedToken = await auth.verifyIdToken(token);
  }

  return (
    <div className="max-w-screen-lg mx-auto">
      <h1 className="text-5xl font-bold p-5">Property Search</h1>
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <Suspense>
            <FiltersForm />
          </Suspense>
        </CardContent>
      </Card>
      <div className="grid grid-cols-3 mt-5 gap-5">
        {data.map((property) => {
          const addressLines = [
            property.address1,
            property.address2,
            property.city,
            property.postcode,
          ]
            .filter((addressLines) => !!addressLines)
            .join(", ");

          return (
            <Card key={property.id} className="overflow-hidden">
              <CardContent className="px-0 pb-0">
                <div
                  className="
                  h-40 relative bg-sky-50 text-zinc-400 flex flex-col 
                  justify-center items-center"
                >
                  {(!verifiedToken || !verifiedToken.admin) && (
                    <ToggleFavouritesButton
                      isFavourite={userFavourites[property.id]}
                      propertyId={property.id}
                    />
                  )}
                  {!!property.images?.[0] && (
                    <Image
                      src={imageUrlFormatter(property.images[0])}
                      className="object-cover w-full h-full"
                      alt=""
                      width={100}
                      height={100}
                    />
                  )}
                  {!property.images?.[0] && (
                    <>
                      <HomeIcon />
                      <small>No Image</small>
                    </>
                  )}
                </div>
                <div className="flex flex-col gap-5 p-5">
                  <p>{addressLines}</p>
                  <div className="flex gap-5">
                    <div className="flex gap-2">
                      <BedIcon />
                      {property.bedrooms}
                    </div>
                    <div className="flex gap-2">
                      <BathIcon />
                      {property.bathrooms}
                    </div>
                  </div>
                  <p className="text-2xl">
                    £{numeral(property.price).format("0,0")}
                  </p>
                  <Button asChild>
                    <Link href={`/property/${property.id}`}>
                      View PropertyView Property
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
      <div className="flex justify-center items-center gap-2 py-10">
        {Array.from({ length: totalPages }).map((_, index) => {
          const newSearchParams = new URLSearchParams();

          if (searchParamsValues?.minPrice) {
            newSearchParams.set("minPrice", searchParamsValues.minPrice);
          }

          if (searchParamsValues?.maxPrice) {
            newSearchParams.set("maxPrice", searchParamsValues.maxPrice);
          }

          if (searchParamsValues?.minBedrooms) {
            newSearchParams.set("minBedrooms", searchParamsValues.minBedrooms);
          }

          newSearchParams.set("page", `${index + 1}`);

          return (
            <Button
              key={index}
              asChild={page !== index + 1}
              disabled={page === index + 1}
              variant="outline"
            >
              <Link href={`property-search?${newSearchParams.toString()}`}>
                {index + 1}
              </Link>
            </Button>
          );
        })}
      </div>
    </div>
  );
}
