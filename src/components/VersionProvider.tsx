"use client";

import { useEffect } from "react";
import { checkStorageVersion } from "@/lib/storage";

const VersionProvider = () => {
  useEffect(() => {
    checkStorageVersion();
  }, []);

  return null;
};

export default VersionProvider;
