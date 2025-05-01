import LineInfoSkeleton from "./LineInfoSkeleton";
import ScanResultSkeleton from "./ScanResultSkeleton";
import ProductDetailsSkeleton from "./ProductDetailsSkeleton";

export default function ScanSkeletonGroup() {
  return (
    <div className="animate-fade-up">
      <LineInfoSkeleton />
      <ScanResultSkeleton />
      <ProductDetailsSkeleton />
    </div>
  );
}
