import PropertyStatusBadge from "@/components/property-status-badge";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { getPropertyById } from "@/data/properties";
import { BathIcon, BedIcon } from "lucide-react";
import Image from "next/image";
import numeral from "numeral";
import ReactMarkdown from "react-markdown";
import BackButton from "@/app/property/[propertyId]/back-button";

export default async function PropertyPage({
  params,
}: {
  params: Promise<any>;
}) {
  const paramsValue = await params;
  const property = await getPropertyById(paramsValue.propertyId);

  console.log({ property });

  const addressLines = [
    property.address1,
    property.address2,
    property.city,
    property.postcode,
  ].filter((addressLines) => !!addressLines);

  return (
    <div className="grid grid-cols-[1fr_500px]">
      <div>
        {!!property.images && (
          <Carousel className="w-full ">
            <CarouselContent>
              {property.images.map((image, index) => (
                <CarouselItem key={image}>
                  <div className="relative h-[80vh] min-h-80">
                    <Image
                      src={`https://firebasestorage.googleapis.com/v0/b/fire-homes-course-521e5.appspot.com/o/${encodeURIComponent(
                        image
                      )}?alt=media`}
                      alt={`image ${index + 1}`}
                      className="object-cover"
                      width={500}
                      height={500}
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            {property.images.length > 1 && (
              <>
                <CarouselPrevious className="translate-x-24 size-12" />
                <CarouselNext className="-translate-x-24 size-12" />
              </>
            )}
          </Carousel>
        )}
        <div className="property-description max-w-screen-md mx-auto py-10 px-4">
          <BackButton />
          <ReactMarkdown>{property.description}</ReactMarkdown>
        </div>
      </div>
      <div className="bg-sky-200 h-screen p-10 sticky top-0 grid place-items-center">
        <div className="flex flex-col gap-10 w-full">
          <PropertyStatusBadge
            status={property.status}
            className="mr-auto text-base"
          />
          <h1 className="text-4xl font-semibold ">
            {addressLines.map((addressLine, index) => (
              <div key={index}>
                {addressLine}
                {index < addressLines.length - 1 && ","}
              </div>
            ))}
          </h1>
          <h2 className="text-3xl font-light">
            £{numeral(property.price).format("0,0")}
          </h2>
          <div className="flex gap-10">
            <div className="flex gap-2">
              <BedIcon />
              {property.bedrooms} Bedrooms
            </div>
            <div className="flex gap-2">
              <BathIcon />
              {property.bathrooms} Bathrooms
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}