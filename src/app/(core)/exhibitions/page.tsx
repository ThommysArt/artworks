"use client"

import React from "react";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import ExhibitionCard from "@/components/exhibition-card";

const ExhibitionsPage = () => {
  const upcoming = useQuery(api.exhibitions.getExhibitions, { status: "upcoming" }) || [];
  const active = useQuery(api.exhibitions.getExhibitions, { status: "active" }) || [];
  const exhibitions = [...upcoming, ...active];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {exhibitions.length === 0 && <div>No exhibitions found.</div>}
      {exhibitions.map((exhibition) => (
        <ExhibitionCard key={exhibition._id} exhibition={exhibition} />
      ))}
    </div>
  );
};

export default ExhibitionsPage;