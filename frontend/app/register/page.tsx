export default function Register() {
  return (
    <div className="flex justify-center min-h-screen px-10 2xl:px-64 py-5">
      {/* Left Side */}
      <div className="w-1/2 bg-blue-600 text-white rounded-l-xl hidden xl:flex flex-col justify-center items-center p-10">
        <h1 className="text-5xl font-semibold">
          Log in or sign in and <br /> start{" "}
          <span className="text-purple-300">share your thoughts.</span>
        </h1>
      </div>

      {/* Right Side */}
      <div className="lg:w-1/2 bg-white rounded-xl xl:rounded-r-xl flex flex-col items-center justify-center xl:p-10">
        <h2 className="text-5xl text-purple-600 font-semibold mb-10">
          Sign In
        </h2>
        <form className="space-y-4 w-5/6">
          <div className="flex space-x-4">
            <input
              type="text"
              placeholder="First Name"
              name="firstname"
              className="w-1/2 p-3 border border-gray-300 rounded-md"
            />
            <input
              type="text"
              placeholder="Last Name"
              name="lastname"
              className="w-1/2 p-3 border border-gray-300 rounded-md"
            />
          </div>
          <input
            type="email"
            placeholder="Email"
            name="email"
            className="w-full p-3 border border-gray-300 rounded-md"
          />
          <input
            type="text"
            placeholder="Nickname"
            name="nickname"
            className="w-full p-3 border border-gray-300 rounded-md"
          />

          {/* Date of Birth*/}
          <input
            type="date"
            name="dateOfBirth"
            className="w-full p-3 border border-gray-300 rounded-md"
          />

          <input
            type="password"
            placeholder="Password"
            name="password"
            className="w-full p-3 border border-gray-300 rounded-md"
          />
          <textarea
            placeholder="About Me"
            name="about_me"
            className="w-full p-3 border border-gray-300 rounded-md h-20"
          ></textarea>
          <select
            name="private"
            className="w-full p-3 border border-gray-300 rounded-md"
          >
            <option value="" disabled selected>
              Select account privacy
            </option>
            <option value="private">private</option>
            <option value="public">public</option>
          </select>
          <input
            type="file"
            name="profilPicture"
            className="w-full p-3 border border-gray-300 rounded-md bg-gray-100 text-gray-500"
          />

          <button className="w-full bg-blue-600 text-white px-4 py-4 rounded-md hover:bg-blue-700">
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}
