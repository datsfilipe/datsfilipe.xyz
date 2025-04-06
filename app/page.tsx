import { BlogPosts } from 'app/components/posts'

export default function Page() {
  return (
    <section>
      <h1 className="mb-8 text-2xl font-semibold tracking-tighter relative overflow-hidden group w-fit cursor-pointer">
        <span className="inline-block transition-transform duration-300 transform group-hover:-translate-y-full">
          Filipe Lima
        </span>
        <span className="absolute left-0 top-0 transition-transform duration-300 transform translate-y-full group-hover:translate-y-0">
          datsfilipe
        </span>
      </h1>
      <p className="mb-4 text-justify">
        {`I'm a 23 years old Fullstack Software Engineer from Brazil who specializes in web development.
        Currently, I work at D3, and together we are creating the next generation of Web3 domains.`}
      </p>
      <p className="mb-4 text-justify">
        {`I'm proficient with the majority of the mostly used web development tools from the Javascript/Typescript ecosystem,
        and also have experience working with integration of web3 functionality into traditional applications.`}
      </p>
      <div className="my-8">
        <BlogPosts />
      </div>
    </section>
  )
}
