import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import Link from 'next/link'
import useSWR from "swr";
import { Post, Sub } from '../types'
import axios from 'axios'
import { useAuthState } from '../context/auth'
import useSWRInfinite from "swr/infinite";
import PostCard from '../components/PostCard'
import { useEffect, useState } from 'react'

const Home: NextPage = () => {
  const {authenticated} = useAuthState();

  const fetcher = async (url: string) => {
    return await axios.get(url).then(res => res.data)
  }

  const address = "http://localhost:4000/api/subs/sub/topSubs"

  const getKey = (pageIndex: number, previousPageData: Post[]) => {
    if (previousPageData && previousPageData.length) return null;
    return `/posts?page=${pageIndex}`;
  }

  const {data, error, size: page, setSize: setPage, isValidating, mutate} = useSWRInfinite<Post[]>(getKey);
  const isInitialLoading = !data && !error;
  const posts: Post[] = data ? ([] as Post[]).concat(...data) : [];
  const {data: topSubs} = useSWR<Sub[]>(address, fetcher);
  console.log('topSubs', topSubs);

  const [observedPost, setObservedPost] = useState("");

  useEffect(() => {
    // 포스트가 없다면 return
    if (!posts || posts.length == 0) return;
    // posts 배열 안의 마지막 post id를 가져옵니다.
    const id = posts[posts.length -1].identifier;
    // posts 배열에 posts가 추가돼서 마지막 post가 바뀌었다면 바뀐 post중 마지막 post를 observedPost로 해줍니다.
    if (id !== observedPost) {
      setObservedPost(id);
      observeElement(document.getElementById(id));
    }
  }, [posts]);

  const observeElement = (element: HTMLElement | null) => {
    if (!element) return;
    // 브라우저 viewPort와 설정한 요소의 교차점을 관찰
    const observer = new IntersectionObserver(
      // entries는 IntersectionObserverEntry 인스턴스 배열
      (entries) => {
        // isIntersecting: 관찰 대상의 교차 상태 (boolean)
        if (entries[0].isIntersecting === true) {
          console.log("마지막 포스트에 왔습니다.");
          setPage(page + 1);
          observer.unobserve(element)
        }
      },
      {threshold: 1}
    );
    // 대상 요소의 관찰을 시작
    observer.observe(element);
  }

  return (
    <div className='flex max-w-5xl px-4 pt-5 mx-auto'>
      {/* 포스트 리스트 */}
      {/* 포스트 리스트의 사이즈에 따라서 사이즈가 반응형으로 달라지도록 기능 구현*/}
      <div className='w-full md:mr-3 md:w-8/12'>
        {isInitialLoading && <p className='text-lg text-center'>로딩중입니다..</p>}
        {posts?.map(post => (
          <PostCard
            key={post.identifier}
            post={post}
            mutate={mutate}
          />
        ))}
      </div>

      {/* 사이드바 */}
      <div className='hidden w-4/12 ml-3 md:block'>
        <div className='bg-white border rounded'>
          <div className='p-4 border-b'>
            <p className='text-lg font-semibold text-center'>상위 커뮤니티</p>
          </div>
          {/* 커뮤니티 리스트 */}
            <div>
              {topSubs?.map((sub) => (
                <div
                  key={sub.name}
                  className='flex items-center px-4 py-2 text-xs border-b'
                >
                  <Link href={`/r/${sub.name}`}>
                    <Image
                      src={sub.imageUrl}
                      className='rounded-full cursor-pointer'
                      alt="Sub"
                      width={24}
                      height={24}
                    />
                  </Link>
                  <Link
                    href={`/r/${sub.name}`} className='ml-2 font-bold hover:cursor-pointer'>
                      /r/{sub.name}
                  </Link>
                  <p className='ml-auto font-md'>{sub.postCount}</p>
                </div>
              ))}
            </div>
            {authenticated &&
              <div className='w-full py-6 text-center'>
                <Link href="/subs/create" className='w-full p-2 text-center text-white bg-gray-400 rounded'>
                  커뮤니티 만들기
                </Link>
              </div>
            }
          </div>
        </div>
      </div>
  )
}

export default Home
