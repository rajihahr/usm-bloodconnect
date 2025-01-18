import React, { useEffect, useState } from "react";
import { BloodTypeCard } from "./BloodTypeCard";
import BloodTypeBarChart from "./BloodTypeBarChart";
import styles from "./BloodBankDashboard.module.css";

const bloodTypeIcons = {
  "A+": "https://cdn.builder.io/api/v1/image/assets/TEMP/df74991bd00685ce355fc178401b48d527bfb781b20af75db78bc86e49683bce",
  "B+": "https://cdn.builder.io/api/v1/image/assets/TEMP/61bb7519bf47e08377d6c60adb85dc82c806f631b28e489e2cb9aca45c20ded1",
  // ... add other blood type icons
};

export const BloodBankDashboard = () => {
  const [bloodBankData, setBloodBankData] = useState({
    bloodTypes: [],
    totalDonors: 0,
    totalBloodUnits: 0,
  });

  const handleRefresh = () => {
    fetchBloodBankData();
  };

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchBloodBankData();
  }, []);

  const fetchBloodBankData = async () => {
    try {
      const response = await fetch("http://localhost:8081/bloodbank");
      if (!response.ok) {
        throw new Error("Failed to fetch blood bank data");
      }
      const data = await response.json();
      setBloodBankData(data);
    } catch (error) {
      console.error("Error fetching blood bank data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const bloodTypesWithIcons = bloodBankData.bloodTypes.map((blood) => ({
    type: blood.bloodType,
    quantity: blood.quantity,
    iconSrc: bloodTypeIcons[blood.bloodType] || bloodTypeIcons["A+"], // fallback icon
  }));

  return (
    <main>
      <div className={styles.authContainer}>
        <section className={styles.bloodBankContainer}>
          <h2 className={styles.dashboardTitle}>
            BloodBank Analytics Dashboard
          </h2>

          {/* Bar Chart */}
          <div className={styles.analyticsChartContainer}>
            <BloodTypeBarChart bloodTypes={bloodTypesWithIcons} />
          </div>

          <div className={styles.bloodStatsGrid}>
            {/* Blood Type Cards */}
            {bloodTypesWithIcons.map((bloodType, index) => (
              <div key={bloodType.type}>
                <BloodTypeCard
                  type={bloodType.type}
                  quantity={bloodType.quantity}
                  iconSrc={bloodType.iconSrc}
                />
              </div>
            ))}

            {/* Total Statistics */}
            <div>
              <BloodTypeCard
                type="Total Donors"
                quantity={bloodBankData.totalDonors}
                iconSrc="https://cdn.builder.io/api/v1/image/assets/TEMP/36eda7da0cbb7660e9aa269ef00e937660cddb6a07595a3470bff3989be6d662"
              />
            </div>

            <div>
              <BloodTypeCard
                type="Total Blood Unit"
                quantity={bloodBankData.totalBloodUnits}
                iconSrc="https://cdn.builder.io/api/v1/image/assets/TEMP/25bd3b01084e3a98dd8fa7fbe67f26f70c9b8b0f4ccec8411be140cd6c26431f"
              />
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};