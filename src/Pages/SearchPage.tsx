import React, { useEffect, useState } from "react";
import TopNav from "../Components/TopNav";
import styled from "styled-components";
import bk from "../Images/header-search.png";
import api from "../Components/API";
import { Pagination, Stack } from "@mui/material/";
import { useNavigate, useParams } from "react-router-dom";

interface StoreData {
  items: StoreInfo[];
  totalPage: number;
}

interface StoreInfo {
  description: string;
  storeID: number;
  storeName: string;
}

export default function SearchPage() {
  const nav = useNavigate();

  const { keyword } = useParams();

  const [currentKeyword, setCurrentKeyword] = useState(
    keyword === undefined ? "" : keyword
  );

  const [searchValue, setSearchtValue] = useState("");

  const [storeData, setStoreData] = useState<StoreData>();
  const [page, setPage] = useState<number>(1);
  const pageLimit = 12;

  const getStores = async () => {
    try {
      const response = await api.get(
        `/store/search?page=${page}&pageLimit=${pageLimit}&keyword=${currentKeyword}`
      );
      const data = response?.data;

      return data;
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const data = await getStores();
      setStoreData(data);
    };
    fetchData();
  }, [page, currentKeyword]);

  return (
    <>
      <TopNav />
      <HeaderSearch>
        <HeaderTitle>搜尋賣家</HeaderTitle>
        <FormSearch>
          <SearchBar>
            <article style={{ boxSizing: "border-box", width: "100%" }}>
              <SearchBarInput
                value={searchValue}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setSearchtValue(e.target.value)
                }
              ></SearchBarInput>
            </article>
            <SearchBarButton
              onClick={() => {
                setCurrentKeyword(searchValue);
                nav(`/searchpage/${searchValue}`);
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="13"
                height="13"
                viewBox="0 0 13 13"
                fill="none"
              >
                <g clipPath="url(#clip0_2_683)">
                  <path
                    d="M9.34657 7.99355H8.79957L8.59457 7.82255C9.27901 7.00576 9.65426 5.9742 9.65457 4.90855C9.64883 4.03327 9.38381 3.17932 8.89298 2.45458C8.40215 1.72985 7.70755 1.16683 6.8969 0.836671C6.08626 0.506508 5.19594 0.424006 4.33843 0.599586C3.48092 0.775166 2.69468 1.20095 2.07904 1.82316C1.4634 2.44536 1.04597 3.23607 0.879492 4.09539C0.713012 4.95471 0.804947 5.8441 1.14369 6.6512C1.48242 7.4583 2.05277 8.1469 2.78267 8.63002C3.51256 9.11313 4.36927 9.36909 5.24457 9.36555C6.30719 9.35891 7.33447 8.98314 8.15057 8.30255L8.35557 8.47355V9.02155L11.7736 12.4505L12.7996 11.4215L9.34657 7.99355ZM5.24657 7.99355C4.63583 7.99533 4.0383 7.81585 3.52963 7.47784C3.02096 7.13983 2.62402 6.65849 2.38907 6.09476C2.15411 5.53103 2.09171 4.91025 2.20977 4.31104C2.32783 3.71182 2.62103 3.1611 3.05225 2.72862C3.48348 2.29613 4.03333 2.00132 4.6322 1.88152C5.23107 1.76171 5.85202 1.8223 6.41644 2.0556C6.98086 2.28891 7.46336 2.68444 7.80285 3.19213C8.14234 3.69981 8.32357 4.29681 8.32357 4.90755C8.32581 5.31285 8.24776 5.71458 8.09391 6.08954C7.94006 6.46451 7.71346 6.80529 7.42719 7.09221C7.14092 7.37913 6.80066 7.6065 6.42604 7.7612C6.05142 7.91591 5.64987 7.99488 5.24457 7.99355H5.24657Z"
                    fill="white"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_2_683">
                    <rect
                      width="12"
                      height="12"
                      fill="white"
                      transform="translate(0.799561 0.450562)"
                    />
                  </clipPath>
                </defs>
              </svg>
            </SearchBarButton>
          </SearchBar>
        </FormSearch>
      </HeaderSearch>

      <Container>
        <ContainerArticle>
          {storeData === undefined || typeof storeData === "string" ? (
            <h3 style={{ textAlign: "center" }}>Not Found</h3>
          ) : (
            <CartItems>
              {storeData.items.map((item, index) => (
                <CartItem
                  key={index}
                  onClick={() => nav(`/storepage/${item.storeID}`)}
                >
                  <CartItemInfo>
                    <CartItemAvatar>L</CartItemAvatar>
                    <CartItemContent>
                      <h3>{item.storeName}</h3>
                      <h5>{item.description}</h5>
                    </CartItemContent>
                  </CartItemInfo>
                </CartItem>
              ))}
            </CartItems>
          )}
        </ContainerArticle>
        <Stack alignItems="center">
          <Pagination
            count={storeData?.totalPage}
            page={page}
            onChange={(event, value: number) =>
              setPage(typeof value === "number" ? value : 0)
            }
          />
        </Stack>
      </Container>
    </>
  );
}

const HeaderSearch = styled.header`
    background-image: url(${bk});
    position: relative;
    height: 320px;
    display: flex;
    flex-flow: column
    background-position: 30%;
    background-size: cover;
    background-repeat: no-repeat;
    flex-flow: column;
    align-items: center;
    justify-content: center;

    &:before {
        background-color: #1f100b;
        opacity: 0.5;
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 100%;
        content: "";
    }
`;

const HeaderTitle = styled.h2`
  position: relative;
  color: #fff;
  font-size: 2.5rem;
  font-weight: 500;
  display: flex;
  flex-flow: column;
`;

const FormSearch = styled.form`
  position: relative;
  margin-top: 1.5rem;
  max-width: 600px;
  width: 100%;
  transform: scale(1.1);
  width: 100%;
  height: 40px;
  border-radius: 8px;
  background-color: #fff;
  border: 1px solid #dfe3ea;
  display: flex;
  justify-content: space-between;
`;

const SearchBarInput = styled.input`
  border-radius: 8px 0 0 8px;
  color: #747693;
  writing-mode: horizontal-tb !important;
  padding-block: 1px;
  padding-inline: 2px;
  padding: 0 20px;
  width: 100%;
  height: 100%;
  outline: none;
  border: none;
  letter-spacing: 3px;
  font-size: 0.75rem;
`;

const Container = styled.main`
  flex-direction: column;
  display: flex;
  padding-top: 20px;
  background-color: #faf7f7;
  flex: 1 1;
  padding: 25px 40px;
`;

const ContainerArticle = styled.article`
  margin-bottom: 25px;
`;

const CartItems = styled.ul`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 15px;
`;

const CartItem = styled.li`
  display: inline-flex;
  flex-direction: column;
  justify-content: space-between;
  color: #747693;
  font-size: 0.85rem;
  border-radius: 8px;
  background-color: #fff;
  border: 1px solid #dfe3ea;
	cursor:pointer;
`;

const CartItemInfo = styled.main`
  position: relative;
  padding: 20px;
  display: flex;
  flex-flow: row;
`;

const CartItemAvatar = styled.article`
  margin-right: 20px;
  background-color: #747693;
  color: #fff;
  text-transform: capitalize;
  letter-spacing: 0;
  font-size: 2.25rem;
  width: 80px;
  height: 80px;
  border-radius: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const CartItemContent = styled.article`
  flex: 1 1;
  color: #747693;
`;

const CartItemContentTitle = styled.li`
  margin-bottom: 5px;
  padding-right: 4rem;
  color: #1f100b;
  font-weight: 500;
  font-size: 1rem;
`;

const ItemBages = styled.li`
  margin-top: 5px;
  color: #303584;
  font-size: 0.85rem;
  display: flex;
  align-items: center;
  flex-flow: row;
`;

const ItemInfoItem = styled.li`
  display: -webkit-box;
  overflow: hidden;
  -webkit-box-orient: vertical;
  word-break: break-all;
  -webkit-line-clamp: 3;
  margin-top: 5px;
`;
const ItemFooter = styled.footer`
  display: inline-flex;
  align-items: center;
  flex-wrap: wrap;
  padding: 10px 20px;
  border-top: 1px solid #dfe3ea;
`;
const ItemFooterLink = styled.a`
  margin-right: 1rem;
  color: #3e51fe;
  transition: color 0.3s;
`;

const SearchBar = styled.form`
  width: 100%;
  height: 40px;
  border-radius: 8px;
  background-color: #fff;
  display: flex;
  justify-content: flex-end;
`;

const SearchBarButton = styled.div`
  width: 50px;
  border: none;
  border-radius: 0 8px 8px 0;
  background-color: #3e51fe;
  cursor: pointer;
  transition: background-color 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
`;
