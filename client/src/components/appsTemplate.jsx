const AppTemplate = ({app}) => {
  console.log(app)
  return (
  <div className="poster flex align-center justify-between border-[#1f1e1e] border-b-1 py-4 text-black w-full">
    <div className="left list-none flex flex-col gap-3 w-2/3">
      <li className='title text-[23px] md:text-[25px]'><span className='font-medium pr-4'>AppName</span>{app.name}</li>
        <li className='title text-[23px] md:text-[25px]'><span className='font-medium pr-4'>HomePage_url</span>{app.home}</li>
      <li className='title text-[23px] md:text-[25px]'><span className='font-medium pr-4'>Callback_url</span>{app.callback}</li>
     <li className='title text-[23px] md:text-[25px]'><span className='font-medium pr-4'>secretId</span>{app.clientId}</li>
     <li className='title text-[23px] md:text-[25px]'><span className='font-medium pr-4'>secretCode</span>{app.clientSecret}</li>
    </div>
  </div>
  );
};

export default AppTemplate;