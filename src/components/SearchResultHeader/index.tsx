import ShareButtonModal from "../ShareButtonModal";

interface TitleHeaderWithShareProps {
  title: string;
}

export const TitleHeaderWithShare: React.FC<TitleHeaderWithShareProps> = ({
  title,
}) => (
  <h1 className="text-xl md:text-2xl lg:text-3xl font-bold mb-6 flex items-center">
    {title}
    <div className="ml-2 flex items-center">
      <ShareButtonModal />
    </div>
  </h1>
);
