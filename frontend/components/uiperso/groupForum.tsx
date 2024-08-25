import Image from "next/image";

export default function GroupForum() {
  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
      {/* Cover Image */}
      <div className="relative">
        <Image
          src="/wall.jpg"
          alt="Cover"
          layout="responsive"
          width={1200} // adjust based on your image aspect ratio
          height={300} // adjust based on your image aspect ratio
          className="w-full h-48 object-cover"
        />
        <div className="absolute inset-0 flex items-end p-4 bg-gradient-to-t from-black/60 to-transparent">
          <div className="flex items-center">
            <div className="relative w-14 h-14">
              <Image
                src="/ironman.jpeg"
                alt="UIX Logo"
                layout="fill"
                objectFit="cover"
                className="rounded-full border-4 border-white"
              />
            </div>
            <div className="ml-4 text-white">
              <h1 className="text-xl font-bold">UI/UX Community forum</h1>
              <p className="text-sm">Member since July 2022</p>
            </div>
          </div>
        </div>
      </div>

      {/* Community Info */}
      <div className="p-4">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-gray-600">Public Community • 65.3k members</p>
          </div>
          <div className="flex items-center">
            <div className="flex -space-x-2">
              {[
                "/ironman.jpeg",
                "/ironman.jpeg",
                "/ironman.jpeg",
                "/ironman.jpeg",
                "/ironman.jpeg",
              ].map((src, index) => (
                <div key={index} className="relative w-8 h-8">
                  <Image
                    src={src}
                    alt={`Friend ${index + 1}`}
                    layout="fill"
                    objectFit="cover"
                    className="rounded-full border-2 border-white"
                  />
                </div>
              ))}
            </div>
            <p className="text-sm text-gray-600 ml-2">
              Jiso and 5 other friends are members.
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="mt-4">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <a
                href="#"
                className="border-indigo-500 text-indigo-600 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm"
              >
                Post
              </a>
              <a
                href="#"
                className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm"
              >
                Members
              </a>
              <a
                href="#"
                className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm"
              >
                Events
              </a>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
}
