import { Spinner, Alert, ListGroup } from "react-bootstrap";
import { useSearchParams, useNavigate } from "react-router-dom"; //
import { useState, useEffect } from "react";
import { useGetCategoryFamilyQuery } from "../../redux/apiReducer";
import { useBaseCategoryFamily } from "../../hooks/useBaseCategoryFamily";
import type { CategoryToReturn } from "../../types/types";
import { useFormContext } from "react-hook-form";

const SidebarCategories = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { reset, getValues } = useFormContext();

  const [curentLineage, setCurentCategoryLineage] = useState<
    Array<CategoryToReturn> | undefined
  >(undefined);

  const categoryy = searchParams.get("category");

  const { baseCatFam, baseCatFamLoading, baseCatFamError } =
    useBaseCategoryFamily();

  const {
    data: currentCategoryFamily,
    error,
    isLoading,
  } = useGetCategoryFamilyQuery(categoryy || undefined);

  useEffect(() => {
    if (currentCategoryFamily) {
      setCurentCategoryLineage(
        currentCategoryFamily.lineage.concat(currentCategoryFamily.category)
      );
    } else {
      setCurentCategoryLineage(undefined);
    }
  }, [searchParams, currentCategoryFamily]);

  if (error || baseCatFamError) {
    return (
      <Alert variant="danger">
        error occured when getting categories, try again later.
      </Alert>
    );
  }

  if (isLoading || baseCatFamLoading) {
    return <Spinner animation="border" />;
  }

  const setCurrentCategory = (id: string | null) => {
    const newParams = new URLSearchParams();
    if (id !== null) {
      newParams.set("category", id);
    }
    if (searchParams.get("sortType") !== null) {
      newParams.set("sortType", searchParams.get("sortType") as string);
    }
    if (searchParams.get("resultsPerPage") !== null) {
      newParams.set(
        "resultsPerPage",
        searchParams.get("resultsPerPage") as string
      );
    }

    if (id === "") {
      newParams.delete("category");
    }
    reset({
      category:
        typeof newParams.get("category") === "string"
          ? (newParams.get("category") as string)
          : "",
      sortType: getValues("sortType"),
      resultsPerPage: getValues("resultsPerPage"),
      minPrice: "",
      maxPrice: "",
      search: "",
      availability: "",
      currentPage: 1,
      tags: {},
    });

    navigate(`/products?${newParams.toString()}`);
  };

  return (
    <ListGroup onSelect={(categg) => setCurrentCategory(categg)}>
      <ListGroup.Item eventKey={""} key={"allcatselect"}>
        All Categories
      </ListGroup.Item>
      {baseCatFam && currentCategoryFamily ? (
        baseCatFam.imediateChildren.map((baseCat) => {
          if (
            curentLineage &&
            curentLineage[0] &&
            baseCat.id === curentLineage[0].id
          ) {
            const temp1 = curentLineage.map((e) => (
              <ListGroup.Item eventKey={e.id} key={e.id + "activ"}>
                {">"}
                {e.name}
              </ListGroup.Item>
            ));

            const temp2 = currentCategoryFamily.imediateChildren.map((e) => (
              <ListGroup.Item eventKey={e.id} key={e.id + "children"}>
                {e.name}
              </ListGroup.Item>
            ));

            return temp1.concat(temp2);
          } else {
            return (
              <ListGroup.Item
                eventKey={baseCat.id}
                key={baseCat.id + "inactive"}
              >
                {baseCat.name}
              </ListGroup.Item>
            );
          }
        })
      ) : (
        <Spinner animation="border" />
      )}
    </ListGroup>
  );
};

export default SidebarCategories;
