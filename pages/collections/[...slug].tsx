import type { GetServerSideProps, NextPage } from 'next'
import { ParsedUrlQuery } from 'querystring'
import Collection from '../../components/Collection'
import Item from '../../components/Item'
interface PostProps {
  col_url: string,
  token_id: string,
}

export default function Collections({col_url, token_id}: PostProps) {

  if ( token_id === '' ) {
    return (
      <Collection col_url={col_url} />
    )
  }
  return (
    <Item col_url={col_url} token_id={token_id} />
  )
}

interface IParams extends ParsedUrlQuery {
  slug: string;
}

export const getServerSideProps: GetServerSideProps = async ({params}) => {
  const { slug } = params as IParams
  let col_url = ''
  let token_id = ''
  col_url = slug[0]
  if ( slug.length == 2 ) {
    token_id = slug[1]
  }
  return {
    props: {
      col_url,
      token_id,
    }
  }
}