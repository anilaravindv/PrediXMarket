const footerLink = {
    left: [
        { name: "About Us", link: "#" },
        { name: "News & Updates", link: "#" },
        { name: "Careers", link: "#" },
    ],
    right: [
        { name: "Support", link: "#" },
        { name: "Documentation", link: "#" },
        { name: "FAQ", link: "#" },
    ],
};

const Footer = () => {
    return (
        <>
            <div className="footer flex flex-wrap p-5 mt-12">
                <div className="md:w-1/3  w-full">
                    <div className="text-xl font-bold">Information</div>
                    <ul>
                        {footerLink.left.map(({ name, link }, k) => (
                            <li key={k} className="py-1">
                                <a href={link} className="hover:text-[#512da8]">
                                    {name}{" "}
                                    <span className="text-xs font-semibold bg-gray-300  py-1 px-2 rounded">SOON</span>
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="md:w-1/3 mt-5 md:mt-0  w-full">
                    <div className="text-xl font-bold">Help &amp; Support</div>
                    <ul>
                        {footerLink.right.map(({ name, link }, k) => (
                            <li key={k} className="py-1">
                                <a href={link} className="hover:text-[#512da8]">
                                    {name}{" "}
                                    <span className="text-xs font-semibold bg-gray-300  py-1 px-2 rounded">SOON</span>
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
            <div className="footerBot text-sm p-5 pb-8 mt-5 text-center">
                <div className="border-t border-gray-400 pt-3"> © 2022 PredixMarket. All rights reserved.</div>
            </div>
        </>
    );
};

export default Footer;
