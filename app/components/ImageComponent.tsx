import { ProjectData } from "../../types";
import Image from "next/image";

interface ImageComponentProps {
    src: string;
    index: number;
    setActiveIndex: (index: number) => void;
    handleListenStoredAudio: (
        isListenAgain?: boolean | undefined,
        index?: number | undefined
    ) => void;
    projectData: ProjectData[];
    openProjectDetail: (projectId: string) => void;
}

const ImageComponent = ({
    src,
    index,
    setActiveIndex,
    openProjectDetail,
    handleListenStoredAudio,
    projectData,
}: ImageComponentProps) => {
    return (
        <section>
            <Image
                onDoubleClick={() => {
                    setActiveIndex(index);
                    openProjectDetail(projectData[index].sys.id);
                    handleListenStoredAudio(false, index);
                }}
                src={src}
                alt={
                    projectData[index]?.audioFile?.description ||
                    "Project Image"
                }
                width={projectData[index]?.image.width ?? 0}
                height={projectData[index]?.image.height ?? 0}
                priority
                className="aspect-[16/11] object-cover cursor-pointer"
                draggable="false"
                placeholder={
                    projectData[index]?.image.blurDataURL ? "blur" : "empty"
                }
                blurDataURL={projectData[index].image?.blurDataURL}
            />
            <p className="text-center text-black text-[13px] mt-2 leading-none">
                {index + 1}.jpg
            </p>
        </section>
    );
};

export default ImageComponent;
