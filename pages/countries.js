import { supabase } from '../src/utils/supabase';

function Page({ countries }) {
  return (
    <ul>
      {countries.map((country) => (
        <li key={country.id}>{country.idrssd}</li>
      ))}
    </ul>
  );
}

export async function getServerSideProps() {
  let { data } = await supabase.from('ubpr_ratios_dummy_ubpre019').select()

  return {
    props: {
     countries: data
    },
  }
}

export default Page;
