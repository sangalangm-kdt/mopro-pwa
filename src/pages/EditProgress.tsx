import { useParams } from "react-router-dom";
import { useState } from "react";
import Icon from "@/components/icons/Icons";
import Header from "@/components/navigation/Header";
import { MOCK_SCAN_DATA, PROCESS_VALUES } from "@/constants";
import { isMatchingSerial } from "@/utils/compare-serial";
import ProcessDropdown from "@/components/ProcessDropdown";
import ProgressSlider from "@/components/ProgressSlider";

// Dropdown options: label is what user sees, value is stored/submitted

const EditProgress = () => {
  const { serialNumber } = useParams();

  //for process options
  const processes = PROCESS_VALUES.map((v) => ({
    label: v, // you can replace this later with localized text
    value: v,
  }));

  // Find the matching entry based on serial number
  const product = Object.values(MOCK_SCAN_DATA).find((item) =>
    isMatchingSerial(serialNumber || "", item.serialNumber)
  );

  //for progress slide
  const [progress, setProgress] = useState(
    product?.productDetails.progress || 0
  );

  const [selectedProcess, setSelectedProcess] = useState(
    product?.productDetails.currentProcess || ""
  );

  return (
    <div className="flex flex-col min-h-screen w-full bg-white dark:bg-zinc-900">
      <Header
        title="Edit Progress"
        showBack={true}
        textColorClass="text-gray-800 dark:text-white"
        rightElement={<Icon name="home" />}
      />

      <div className="flex-1 p-4 space-y-4 text-gray-800 dark:text-white">
        <p className="text-sm">
          Update the current process and progress of the product
        </p>

        <div>
          <label className="block text-sm font-medium mb-1">
            Drawing number
          </label>
          <input
            type="text"
            value={serialNumber ?? ""}
            disabled
            className="w-full rounded-md bg-gray-100 text-gray-700 px-3 py-2 text-sm border border-gray-300 dark:bg-zinc-800 dark:text-white dark:border-zinc-700"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Product Name</label>
          <input
            type="text"
            value={product?.productDetails.productName ?? "-"}
            disabled
            className="w-full rounded-md bg-gray-100 text-gray-700 px-3 py-2 text-sm border border-gray-300 dark:bg-zinc-800 dark:text-white dark:border-zinc-700"
          />
        </div>

        <div>
          <ProcessDropdown
            value={selectedProcess}
            onChange={(val: string) => setSelectedProcess(val)}
            options={processes}
          />
        </div>

        <div>
          <ProgressSlider value={progress} onChange={setProgress} />
        </div>
      </div>
    </div>
  );
};

export default EditProgress;
