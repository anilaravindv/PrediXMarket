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
            <div className="w-full flex justify-center border-t border-[#e5e5e5]">
                <div className="footer container px-3 flex-wrap py-16 grid sm:grid-cols-4 grid-cols-1 text-center">
                    <div className="footerBot text-sm sm:text-left sm:col-span-2 mb-6">
                        © 2022 <strong>PredixMarket</strong>. All rights reserved.
                    </div>
                    <div className="col-span-1 sm:text-right text-sm mb-6">
                        <div className="font-bold">Information</div>
                        <ul>
                            {footerLink.left.map(({ name, link }, k) => (
                                <li key={k} className="py-1">
                                    <a href={link} className="hover:text-[#512da8]">
                                        {name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="col-span-1 sm:text-right text-sm">
                        <div className="font-bold">Help &amp; Support</div>
                        <ul>
                            {footerLink.right.map(({ name, link }, k) => (
                                <li key={k} className="py-1">
                                    <a href={link} className="hover:text-[#512da8]">
                                        {name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Footer;
