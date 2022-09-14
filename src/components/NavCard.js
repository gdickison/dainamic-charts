import Link from "next/link"

const NavCard = ({page, title, icon, description}) => {
  return (
    <div className="container flex justify-center">
        <Link href={page}>
          <a>
      <div className="w-96 h-80 max-w-lg items-center justify-center overflow-hidden rounded-2xl bg-yellow-200 shadow-xl border-2">
            <div className="h-24 bg-white"></div>
            <div className="-mt-20 flex justify-center">
              <img className="h-36 w-36" src={icon} />
            </div>
            <div className="my-5 px-3 text-center text-xl">{title}</div>
            <blockquote>
              <p className="mx-2 my-7 text-center text-base text-slate-600">{description}</p>
            </blockquote>
          </div>
          </a>

        </Link>
    </div>
  )
}

export default NavCard