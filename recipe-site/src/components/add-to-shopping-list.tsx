"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, ShoppingBasket } from "lucide-react";
import { useShoppingList } from "@/hooks/use-shopping-list";
import { useRecipeSession } from "@/components/recipe-session";
import { useT } from "@/components/lang-provider";
import { buttonClass } from "@/components/ui";
import { cn } from "@/lib/utils";

export function AddToShoppingList() {
  const t = useT();
  const { recipeId, title, ingredients } = useRecipeSession();
  const { addMany } = useShoppingList();
  const [justAdded, setJustAdded] = useState(false);

  const onAdd = () => {
    addMany(recipeId, title, ingredients);
    setJustAdded(true);
    window.setTimeout(() => setJustAdded(false), 4000);
  };

  return (
    <div className="flex gap-2">
      <button
        type="button"
        onClick={onAdd}
        disabled={ingredients.length === 0}
        className={cn(buttonClass("secondary"), "flex-1", justAdded && "border-success text-success")}
      >
        {justAdded ? <Check size={18} /> : <ShoppingBasket size={18} />}
        <span aria-live="polite">{justAdded ? t("detail.addedToList") : t("detail.addToList")}</span>
      </button>
      {justAdded && (
        <Link href="/shopping-list" className={buttonClass("ghost")}>
          {t("detail.viewList")}
        </Link>
      )}
    </div>
  );
}
