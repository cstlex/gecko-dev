/* -*- Mode: C++; tab-width: 8; indent-tabs-mode: nil; c-basic-offset: 2 -*- */
/* vim: set ts=8 sts=2 et sw=2 tw=80: */
/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

#ifndef mozilla_dom_SVGRect_h
#define mozilla_dom_SVGRect_h

#include "mozilla/dom/SVGIRect.h"
#include "mozilla/gfx/Rect.h"
#include "nsCOMPtr.h"
#include "SVGElement.h"

////////////////////////////////////////////////////////////////////////
// SVGRect class

namespace mozilla {
namespace dom {

class SVGRect final : public SVGIRect {
 public:
  explicit SVGRect(nsIContent* aParent, float x = 0.0f, float y = 0.0f,
                   float w = 0.0f, float h = 0.0f);

  NS_DECL_CYCLE_COLLECTING_ISUPPORTS
  NS_DECL_CYCLE_COLLECTION_SCRIPT_HOLDER_CLASS(SVGRect)

  // WebIDL
  float X() const final { return mX; }

  void SetX(float aX, ErrorResult& aRv) final { mX = aX; }

  float Y() const final { return mY; }

  void SetY(float aY, ErrorResult& aRv) final { mY = aY; }

  float Width() const final { return mWidth; }

  void SetWidth(float aWidth, ErrorResult& aRv) final { mWidth = aWidth; }

  float Height() const final { return mHeight; }

  void SetHeight(float aHeight, ErrorResult& aRv) final { mHeight = aHeight; }

  virtual nsIContent* GetParentObject() const override { return mParent; }

 protected:
  ~SVGRect() {}

  nsCOMPtr<nsIContent> mParent;
  float mX, mY, mWidth, mHeight;
};

}  // namespace dom
}  // namespace mozilla

already_AddRefed<mozilla::dom::SVGRect> NS_NewSVGRect(nsIContent* aParent,
                                                      float x = 0.0f,
                                                      float y = 0.0f,
                                                      float width = 0.0f,
                                                      float height = 0.0f);

already_AddRefed<mozilla::dom::SVGRect> NS_NewSVGRect(
    nsIContent* aParent, const mozilla::gfx::Rect& rect);

#endif  // mozilla_dom_SVGRect_h
